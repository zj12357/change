import { Button, Card, Col, Form, Input, InputNumber, Row, Select, message, Modal } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon, filterImages, toMoney } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import lodash from 'lodash';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

function filtArea(key) {
  return (
    {
      0: '洲',
      1: '国',
      2: '城市',
    }[key] || '未知'
  );
}

/* eslint react/no-multi-comp:0 */
@connect(({ GetExceptionUserListModel, loading, login }) => ({
  GetExceptionUserListModel,
  login,
  loading: loading.models.GetExceptionUserListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    proxyLineList: [],
  };

  columns = [
    {
      title: '用户名称',
      dataIndex: 'userName',
      width: 150,
      fixed: 'left',
    },
    {
      title: '实名',
      dataIndex: 'realName',
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '代理线',
      dataIndex: 'plName',
    },
    {
      title: '上次登录时间',
      dataIndex: 'lastLoginTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '存款总额',
      dataIndex: 'depositTotal',
      render: val => (val ? toMoney(val) : 0),
    },
    // {
    //   title: '利润总额',
    //   dataIndex: 'profitTotal',
    //   render: val => (val ? toMoney(val) : 0),
    // },
    {
      title: '存款次数',
      dataIndex: 'depositCount',
    },
    {
      title: '上次存款时间',
      dataIndex: 'lastDepositTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '最后存款日',
      dataIndex: 'lastDepositDays',
    },
    {
      title: '上次联机时间',
      dataIndex: 'lastOnlineTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '最近联机天数',
      dataIndex: 'lastOnlineDays',
    },
    {
      title: '联系人',
      dataIndex: 'contactNumber',
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getLineList();
  }

  //获取代理线
  getLineList = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lineUserListModel/proxyLine',
      payload: {
        name: val,
      },
      callback: data => {
        const proxyLineList = data || [];
        this.setState({ proxyLineList });
      },
    });
  };

  fetchProxyList = val => {
    this.debounceFun(val);
  };
  //搜索防抖
  debounceFun = lodash.debounce(function(val) {
    this.getLineList(val);
  }, 700);

  getReloadList = params => {
    const {
      dispatch,
      GetExceptionUserListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'GetExceptionUserListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
      },
      callback: data => {
        //如删除最后一条数据  最后一页没有数据自动往前减一
        const { page = {} } = data;
        const list = data[listId] || [];
        const { pageIndex = 1, pageCount = 1 } = page || {};
        if (pageIndex !== 1 && pageIndex > pageCount && list.length <= 0) {
          this.getReloadList({ ...params, pageIndex: pageIndex - 1 });
        }
      },
    });
  };
  handleUpdateModalVisible = val => {
    this.setState({ editRoleDate: val });
    this.handleModalVisible(true);
  };

  handleUpdateModalVisibleRole = (flag, record) => {
    const { dispatch } = this.props;

    this.setState({
      stepFormValues: record || {},
    });
    if (!!flag) {
      dispatch({
        type: 'GetExceptionUserListModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(() => {
        this.setState({ updateModalVisible: !!flag });
      });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  //更新系统广告图系统广告图
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个系统广告图');
      return false;
    }
    dispatch({
      type: 'GetExceptionUserListModel/update',
      payload: {
        role: id,
        res: fields,
      },
      callback: () => {
        message.success('分配成功');
        this.handleUpdateModalVisibleRole();
      },
    });
  };

  enableAccount = record => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: 'GetExceptionUserListModel/enableAccount',
      payload: {
        id,
        enable: record.enable ? false : true,
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.getReloadList(params);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState(
      {
        formValues: {},
      },
      () => this.getReloadList({ pageIndex: 1 }),
    );
  };

  //type ='itemDelete'  否则删除多个
  handleMenuClick = (type, record) => {
    const _this = this;
    Modal.confirm({
      title: '删除',
      content: '您确定要删除当前内容嘛?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const { dispatch } = _this.props;
        const { selectedRows } = _this.state;
        if (!selectedRows) return;

        dispatch({
          type: 'GetExceptionUserListModel/remove',
          payload: { [keysID]: record[keysID] },
          callback: () => {
            message.success('删除成功');
            _this.setState({
              selectedRows: [],
            });
            _this.getReloadList();
          },
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      this.getReloadList({ ...values, pageIndex: 1 });
    });
  };

  handleModalVisible = (flag, type, parentID) => {
    let updateData = { modalVisible: !!flag };

    if (type === 'add') {
      updateData.editRoleDate = {};
      //  this.setState({editRoleDate:{}})
    }

    if (parentID) {
      updateData.parentID = parentID;
    } else {
      updateData.parentID = '';
    }

    this.setState({
      ...updateData,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {}, parentID } = this.state;

    if (parentID) fields.parent = parentID;
    // console.log('parentID',parentID,fields)
    dispatch({
      type: 'GetExceptionUserListModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        this.setState({ parentID: '' });
        message.success(fields[keysID] ? '修改成功' : '添加成功');
        this.handleModalVisible();
      },
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { proxyLineList } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={7} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('search')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="代理线">
              {form.getFieldDecorator('plid', {
                rules: [
                  {
                    required: false,
                    message: '请选择代理线',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择代理线"
                  onSearch={this.fetchProxyList}
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {proxyLineList.map(item => (
                    <Option value={item.plid} key={item.plid}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="复存次数">
              {getFieldDecorator('multipleCount')(
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      GetExceptionUserListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; //分配系统广告图列表
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisibleRole,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.QueryList) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.QueryList) || 'search'}
                  onClick={this.handleSearch}
                >
                  查询
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Resetting) ? (
                <Button
                  type="primary"
                  icon="sync"
                  style={{
                    marginLeft: 8,
                  }}
                  onClick={this.handleFormReset}
                >
                  重置
                </Button>
              ) : (
                false
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible ? (
          <CreateForm {...parentMethods} modalVisible={modalVisible} editRoleDate={editRoleDate} />
        ) : (
          false
        )}

        {stepFormValues &&
        updateModalVisible &&
        Object.keys(stepFormValues).length &&
        Array.isArray(allResourcesList) &&
        allResourcesList.length > 0 ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            allResourcesList={allResourcesList}
            yelResourcesList={yelResourcesList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
