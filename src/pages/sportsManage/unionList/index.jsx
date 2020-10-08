import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  message,
  Modal,
  Cascader,
  Popover,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { filtEleBtn, takeIcon, filterImages } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const options = [
  {
    name: '洲',
    id: 0,
    isLeaf: false,
  },
  {
    name: '国',
    id: 1,
    isLeaf: false,
  },
  {
    name: '城市',
    id: 2,
    isLeaf: false,
  },
];
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
@connect(({ unionListModel, loading, login }) => ({
  unionListModel,
  login,
  loading: loading.models.unionListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    options,
    LeagueLevel:[]
  };

  columns = [
    {
      title: '联赛名称',
      fixed: 'left',
      width: 200,
      render: item => (
        <Popover
          content={
            `英文名：${item.enName ? item.enName : ''}  ` +
            `  所属国家：${item.countryByName ? item.countryByName : ''}`
          }
          title="详情"
          trigger="hover"
        >
          <div>
            <img
              src={filterImages(item.logo)}
              alt=""
              style={{ width: '36px', marginRight: '10px' }}
            />
            <span>{item.name}</span>
          </div>
        </Popover>
      ),
    },

    {
      title: '球队数量',
      dataIndex: 'leagueTeamTotal',
    },
    {
      title: '赛事数量',
      dataIndex: 'competitionTotal',
    },
    {
      title: '预测数量',
      dataIndex: 'predictionTotal',
    },
    {
      title: '精准度',
      dataIndex: 'predictionRate',
    },

    {
      title: '开赛时间',
      dataIndex: 'createTime',
      width: 220,
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getStatusList()
  }

  getReloadList = params => {
    const {
      dispatch,
      unionListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'unionListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
      },
      callback: data => {
        // 如删除最后一条数据  最后一页没有数据自动往前减一
        const { page = {} } = data;
        const list = data[listId] || [];
        this.setState({ selectedRows: [] });
        const { pageIndex = 1, pageCount = 1 } = page || {};
        if (pageIndex !== 1 && pageIndex > pageCount && list.length <= 0) {
          this.getReloadList({ ...params, pageIndex: pageIndex - 1 });
        }
      },
    });
  };
  getStatusList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showDisabled: true,
        showType: 3
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let LeagueLevel = list.filter(item => item.parentCode === 'LeagueLevel');
        this.setState({ LeagueLevel });
      },
    });

  };

  handleUpdateModalVisible = val => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    val = selectedRows[0];
    this.setState({ editRoleDate: val });
    this.handleModalVisible(true);
  };

  handleUpdateModalVisibleRole = (flag, record) => {
    const { dispatch } = this.props;

    this.setState({
      stepFormValues: record || {},
    });
    if (flag) {
      dispatch({
        type: 'unionListModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(() => {
        this.setState({ updateModalVisible: !!flag });
      });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  // 更新联盟联盟
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个联盟');
      return false;
    }
    dispatch({
      type: 'unionListModel/update',
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
      type: 'unionListModel/enableAccount',
      payload: {
        id,
        enable: !record.enable,
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
        selectedRows: [],
      },
      () => this.getReloadList({ pageIndex: 1 }),
    );
  };

  // type ='itemDelete'  否则删除多个
  handleMenuClick = (type, record) => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
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
          type: 'unionListModel/remove',
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
      const countryById = fieldsValue.countryById;

      let values = {
        ...fieldsValue,
      };

      if (Array.isArray(countryById) && countryById.length > 1) {
        values.countryById = countryById[1];
      } else {
        values.countryById = null;
      }

      this.setState({
        formValues: values,
      });
      this.getReloadList({ ...values, pageIndex: 1 });
    });
  };

  handleModalVisible = (flag, type, parentID) => {
    const updateData = { modalVisible: !!flag };

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

  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
  };

  loadData = selectedOptions => {
    const { dispatch } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const level = targetOption.id;
    targetOption.loading = true;

    dispatch({
      type: 'areaListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        level,
      },
      callback: data => {
        targetOption.loading = false;
        targetOption.children = data.list || [];
        this.setState({
          options: [...this.state.options],
        });
      },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {}, parentID } = this.state;

    if (parentID) fields.parent = parentID;
    // console.log('parentID',parentID,fields)
    dispatch({
      type: 'unionListModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        this.setState({ parentID: '', selectedRows: [] });
        message.success(fields[keysID] ? '修改成功' : '添加成功');
        this.handleModalVisible();
      },
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

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
            <FormItem label="联赛名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="英文名称">
              {getFieldDecorator('enName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="所属区域">
              {getFieldDecorator('countryById')(
                <Cascader
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  notFoundContent={'暂无数据'}
                  placeholder={'请选择'}
                />,
              )}
            </FormItem>
          </Col>

          <a
            style={{
              marginLeft: 8,
            }}
            onClick={this.toggleForm}
          >
            展开 <Icon type="down" />
          </a>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {LeagueLevel} =this.state
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
            <FormItem label="联赛名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="英文名称">
              {getFieldDecorator('enName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="所属区域">
              {getFieldDecorator('countryById')(
                <Cascader
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  notFoundContent={'暂无数据'}
                  placeholder={'请选择'}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={7} sm={24}>
            <FormItem label="等级">
              {getFieldDecorator('level')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >

                  {
                    LeagueLevel.map((item,index)=> <Option value={Number(item.code)} key={index}>{item.displayName}</Option>)
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <a
            style={{
              marginLeft: 8,
            }}
            onClick={this.toggleForm}
          >
            收起 <Icon type="up" />
          </a>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm = false } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  render() {
    const {
      unionListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; // 分配联盟列表
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

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Add) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Add) || 'plus'}
                  onClick={() => this.handleModalVisible(true, 'add')}
                >
                  新建
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Edit) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Edit) || 'edit'}
                  onClick={() => this.handleUpdateModalVisible()}
                >
                  编辑
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Delete) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Delete) || 'delete'}
                  onClick={() => this.handleMenuClick('itemDelete')}
                >
                  删除
                </Button>
              ) : (
                false
              )}
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button  icon='delete' type="danger"  onClick={this.handleMenuClick}>批量删除</Button>

                </span>
              )} */}
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
