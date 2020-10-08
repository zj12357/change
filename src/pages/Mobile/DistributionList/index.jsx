import { Button, Card, Col, Form, Input, Row, Select, message, Modal, Spin, Icon } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import NumberRecordList from './components/NumberRecordList';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon, filterImages } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import { baseUrl } from '@/utils/config.js';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const applyState = {
  Save: '保存',
  Apply: '申请',
  Back: '回退',
  Confirm: '通过',
};

@connect(({ DistributionListModel, loading, login }) => ({
  DistributionListModel,
  login,
  loading: loading.models.DistributionListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    modalVisibleUpload: false,
    NumberApplyState: [],
    userList: [],
    NumberRecord: {},
    NumberRecordSVisible: false,
  };

  columns = [
    {
      title: '主题',
      dataIndex: 'applyTitle',
      width: 150,
      fixed: 'left',
    },
    {
      title: '申请人',
      dataIndex: 'applyUserName',
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '申请数量',
      dataIndex: 'applyCount',
    },
    {
      title: '申请状态',
      dataIndex: 'applyStateName',
    },
    {
      title: '实际分配数量',
      dataIndex: 'confirmCount',
    },
    {
      title: '审核人',
      dataIndex: 'confirmUserName',
    },
    {
      title: '审核时间',
      dataIndex: 'confirmTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getStatusList();
    this.getUserList();
  }
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
        let NumberApplyState = list.filter(item => item.parentCode === 'NumberApplyState');
        this.setState({ NumberApplyState });
      },
    });
  };
  getReloadList = params => {
    const {
      dispatch,
      DistributionListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;

    dispatch({
      type: 'DistributionListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
      },
      callback: data => {
        //如删除最后一条数据  最后一页没有数据自动往前减一
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
  getUserList = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMangeModel/fetch',
      payload: {
        userName: val,
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const list = data.sysUserList || [];
        this.setState({ userList: list });
      },
    });
  };
  handleUpdateModalVisible = () => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    let val = selectedRows[0];
    if (val.applyState == 'Confirm' || val.applyState == 'Apply') {
      message.info('只有保存或者退回状态才可以修改');
    } else {
      this.setState({ editRoleDate: val, modalVisible: true });
    }
  };
  handleUpdateModalVisibleRecord = () => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    let val = selectedRows[0];
    this.setState({
      NumberRecordDate: val,
      NumberRecordSVisible: !this.state.NumberRecordSVisible,
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
    const { form } = this.props;
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
          type: 'DistributionListModel/remove',
          payload: { id: record.id },
          callback: () => {
            message.success('删除成功');
            _this.setState({
              selectedRows: [],
            });
            _this.getReloadList();
          },
        });
      },
      onCancel() {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
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

  handleModalVisible = flag => {
    let updateData = { modalVisible: !!flag };
    updateData.editRoleDate = {};
    this.setState({
      ...updateData,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'DistributionListModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        message.success(fields[keysID] ? '修改成功' : '添加成功');
        this.handleModalVisible();
      },
    });
  };

  handleApply = () => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    let record = selectedRows[0];
    if (record.applyState == 'Save' || record.applyState == 'Back') {
      const { dispatch } = this.props;
      dispatch({
        type: 'DistributionListModel/apply',
        payload: { id: record.id },
        callback: () => {
          message.success('申请成功');
          this.setState({
            selectedRows: [],
          });
          this.getReloadList();
        },
      });
    } else {
      message.info('只有保存或者回退状态才可以申请');
    }
  };

  handleCancelApply = () => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    let record = selectedRows[0];
    const { dispatch } = this.props;
    dispatch({
      type: 'DistributionListModel/cancelApply',
      payload: { id: record.id },
      callback: () => {
        message.success('撤销成功');
        this.setState({
          selectedRows: [],
        });
        this.getReloadList();
      },
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { NumberApplyState, userList } = this.state;
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
            <FormItem label="主题">
              {getFieldDecorator('applyTitle')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="申请人">
              {getFieldDecorator('applyUserID')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  mode="multiple"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                  // className="tableTop-line"
                >
                  {userList.map((item, index) => (
                    <Option value={item.userID} key={index}>
                      {item.userName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="申请状态">
              {getFieldDecorator('applyState')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {NumberApplyState.map((item, index) => (
                    <Option value={item.code} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  handleModalVisibleUpload = () => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    let val = selectedRows[0];
    if (val.applyState == 'Confirm') {
      message.info('该号码已经审核通过！');
    } else if (val.applyState == 'Apply') {
      this.setState({ editRoleDate: val, modalVisibleUpload: !this.state.modalVisibleUpload });
    } else {
      message.info('只有申请状态才可以审核');
    }
  };

  render() {
    const {
      DistributionListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      modalVisibleUpload,
      NumberRecordSVisible,
      NumberRecordDate,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const parentMethodsUpload = {
      handleModalVisibleUpload: this.handleModalVisibleUpload,
      getReloadList: this.getReloadList,
    };
    const parentMethodsRecord = {
      handleUpdateModalVisibleRecord: this.handleUpdateModalVisibleRecord,
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
                  onClick={() => this.handleModalVisible(true)}
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

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Apply) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Delete) || 'file-add'}
                  onClick={() => this.handleApply()}
                >
                  申请
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.CancelApply,
              ) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Delete) || 'file-excel'}
                  onClick={() => this.handleCancelApply()}
                >
                  撤销申请
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
                    takeIcon(this.props.login.dictionaryList, buttonKey.AuditActivities) || 'diff'
                  }
                  onClick={() => this.handleModalVisibleUpload()}
                >
                  审核
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.ProcessRecord,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.ProcessRecord) || 'profile'
                  }
                  onClick={() => this.handleUpdateModalVisibleRecord()}
                >
                  流程记录
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.NumberRecycling,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.NumberRecycling) || 'rest'
                  }
                >
                  号码回收
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.NumbeDetails,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.NumbeDetails) || 'file-text'
                  }
                >
                  号码明细
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
        {NumberRecordSVisible ? (
          <NumberRecordList
            NumberRecordSVisible={NumberRecordSVisible}
            {...parentMethodsRecord}
            NumberRecordDate={NumberRecordDate}
          />
        ) : null}
        {modalVisibleUpload ? (
          <UpdateForm
            modalVisible={modalVisibleUpload}
            {...parentMethodsUpload}
            editRoleDate={editRoleDate}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
