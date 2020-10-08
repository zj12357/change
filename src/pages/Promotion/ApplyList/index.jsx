import { Button, Card, Col, Form, Icon, Input, Row, Select, message, Modal, Popover } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { filtEleBtn, takeIcon, filterImages } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import CustomRangePicker from '@/components/Picker/CustomRangePicker.jsx';
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
@connect(({ ApplyListModel, loading, login }) => ({
  ApplyListModel,
  login,
  loading: loading.models.ApplyListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    previewImage: '',
    ActivityReviewStatus: [], // 审核状态列表
    stateType: {
      '5': '初审通过',
      '4': '已发放',
      '3': '初审失败',
      '2': '待审核',
      '-1': '拒绝审核',
      '1': '审核通过',
      '0': '审核中',
    },
  };

  columns = [
    {
      title: '活动名',
      dataIndex: 'pName',
      width: 150,
      fixed: 'left',
    },
    {
      title: '申请账号',
      width: 140,
      dataIndex: 'username',
    },
    {
      title: '申请手机号',
      width: 140,
      dataIndex: 'moblie',
    },
    {
      title: '申请时间',
      width: 220,
      dataIndex: 'applyTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '料先生账号',
      dataIndex: 'liaoUsername',
    },
    {
      title: '朋友账号',
      dataIndex: 'RecommendName',
    },
    {
      title: '审核状态',
      dataIndex: 'stateID',
      render: val => (
        <span style={{ color: this.filtStatleColour(val) }}>{this.state.stateType[val]}</span>
      ),
    },
    {
      title: '金额',
      dataIndex: 'applyAmt',
    },
    {
      title: '代理线',
      dataIndex: 'plName',
    },

    {
      title: '申请网址',
      dataIndex: 'applyURL',
    },
    {
      title: '申请IP',
      dataIndex: 'applyIP',
    },
    // {
    //   title: '申请人',
    //   dataIndex: 'application',
    // },
    {
      title: '审核人',
      dataIndex: 'approveUserName',
    },
    {
      title: '审核时间',
      width: 220,
      dataIndex: 'approveTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '用户浏览器',
      dataIndex: 'browser',
      render: val =>
        val ? (
          <Popover
            content={
              <p style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{val}</p>
            }
            title="用户浏览器"
          >
            <a>用户浏览器</a>
          </Popover>
        ) : null,
    },
    {
      title: '用户操作系统',
      dataIndex: 'applyURL',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getStatusList();
  }

  viewApplyImage = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { applyImage } = record;
    if (!applyImage) {
      message.error('当前没有申请活动截图可看!');
      return false;
    }
    this.setState({ previewImage: applyImage });
  };

  handleCancel = () => {
    this.setState({ previewImage: '' });
  };

  // 显示审核状态
  filtStatleColour = (stateName = '2') => {
    const colorType = {
      '2': 'black',
      '-1': 'red',
      '0': '#E7B325',
      '1': 'DarkBlue',
      '4': 'SpringGreen',
      '3': 'red',
      '5': '#E7B325',
    };
    return colorType[stateName];
  };
  getStatusList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showDisabled: true,
        showType: 3,
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let ActivityReviewStatus = list.filter(item => item.parentCode === 'ActivityReviewStatus');
        this.setState({ ActivityReviewStatus });
      },
    });
  };
  getReloadList = params => {
    const {
      dispatch,
      ApplyListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'ApplyListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
      },
      callback: data => {
        // 如删除最后一条数据  最后一页没有数据自动往前减一
        const { page = {} } = data;
        this.setState({ selectedRows: [] });
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
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;
    if (record.stateID == 1) {
      message.info('该活动已经审核通过');
      return;
    } else {
      this.setState({
        stepFormValues: record || {},
      });
    }

    if (flag) {
      this.setState({ updateModalVisible: !!flag });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  // 更新系统广告图系统广告图
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ApplyListModel/update',
      payload: fields,
      callback: () => {
        message.success('审核成功');
        this.handleUpdateModalVisibleRole();
        this.getReloadList();
      },
    });
  };

  enableAccount = record => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: 'ApplyListModel/enableAccount',
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
      },
      () => this.getReloadList({ pageIndex: 1 }),
    );
  };

  // type ='itemDelete'  否则删除多个
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
          type: 'ApplyListModel/remove',
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

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {}, parentID } = this.state;

    if (parentID) fields.parent = parentID;
    // console.log('parentID',parentID,fields)
    dispatch({
      type: 'ApplyListModel/add',
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

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { ActivityReviewStatus } = this.state;
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
            <FormItem label="审核状态">
              {getFieldDecorator('stateID')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择审核状态"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {ActivityReviewStatus.map((item, index) => (
                    <Option value={item.code} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('moblie')(<Input placeholder="请输入" />)}
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
    const { ActivityReviewStatus } = this.state;
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
            <FormItem label="审核状态">
              {getFieldDecorator('stateID')(
                <Select style={{ width: '100%' }} placeholder="请选择审核状态">
                  {ActivityReviewStatus.map((item, index) => (
                    <Option value={item.code} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('moblie')(<Input placeholder="请输入" />)}
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
            <FormItem label="申请IP">
              {getFieldDecorator('applyIP')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="申请日期">
              {getFieldDecorator('applyTime')(<CustomRangePicker />)}
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
      ApplyListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues = {},
      updateModalVisible,
      previewImage,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; // 分配系统广告图列表
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

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.ViewScreenshot,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.ViewScreenshot) || 'eye'
                  }
                  onClick={this.viewApplyImage}
                >
                  查看截图
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.AuditActivities,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.AuditActivities) ||
                    'file-add'
                  }
                  onClick={() => this.handleUpdateModalVisibleRole(true, {})}
                >
                  审核
                </Button>
              ) : (
                false
              )}

              {/* {selectedRows.length > 0 && (
                <span>
                  <Button icon="delete" type="danger" onClick={this.handleMenuClick}>
                    批量删除
                  </Button>
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

        {updateModalVisible && stepFormValues[keysID] ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}

        <Modal visible={!!previewImage} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={filterImages(previewImage)} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
