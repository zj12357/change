import { Button, Card, Col, Form, Input, Row, Select, message, Popover, Modal } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon, filterImages } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import CustomRangePicker from '@/components/Picker/CustomRangePicker.jsx';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

function filtStatus(key) {
  return (
    {
      '0': '未推送',
      '1': '已推送',
      '-1': '撤回',
    }[key] || ''
  );
}

/* eslint react/no-multi-comp:0 */
@connect(({ PushRecordListModel, loading, login }) => ({
  PushRecordListModel,
  login,
  loading: loading.models.PushRecordListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    modeList: [],
    type: 'SendPush', //SendPush 指定用户， AllSendPush  所有用户  RunSportPush  推送比赛消息  彩票结果推送 RunLotterPush
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
      fixed: 'left',
      render: val => (
        <Popover content={val} title="详情" trigger="hover">
          <a>{val && val.length > 14 ? val.slice(0, 14) + '...' : val}</a>
        </Popover>
      ),
    },
    {
      title: '内容',
      width: 220,
      dataIndex: 'content',
      render: val => (
        <Popover content={val} title="详情" trigger="hover">
          <a>{val && val.length > 14 ? val.slice(0, 14) + '...' : val}</a>
        </Popover>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 220,
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '创建人名称',
      dataIndex: 'createUserByName',
    },
    {
      title: '推送状态',
      dataIndex: 'status',
      render: val => filtStatus(val),
    },
    {
      title: '推送时间',
      dataIndex: 'pushTime',
      width: 220,
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '是否已读',
      dataIndex: 'readStatus',
      render: val => (val ? '已读' : '未读'),
    },
  ];

  componentDidMount() {
    this.getReloadList();
  }

  // 极光推送消息 撤销消息
  pushMessgae = (record, type = 'push') => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;
    if (type === 'withdraw') {
      if (record.readStatus) {
        message.error('消息已读状态下，是不能被撤回的！');
        return false;
      }
    }
    const _this = this;
    Modal.confirm({
      title: type === 'push' ? '极光推送消息' : '撤销极光推送',
      content: `您确定要执行${type === 'push' ? '极光推送消息' : '撤销极光推送'}嘛?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'PushRecordListModel/pushJG',
          payload: {
            [keysID]: record[keysID],
            type,
          },
          callback: () => {
            message.success((type === 'push' ? '极光推送消息' : '撤销极光推送') + '成功');
            _this.getReloadList();
          },
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  getReloadList = params => {
    const {
      dispatch,
      PushRecordListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'PushRecordListModel/fetch',
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
        this.setState({ selectedRows: [] });
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
        type: 'PushRecordListModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(() => {
        this.setState({ updateModalVisible: !!flag });
      });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  //更新系统平台系统平台
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个系统平台');
      return false;
    }
    dispatch({
      type: 'PushRecordListModel/update',
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
      type: 'PushRecordListModel/enableAccount',
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
          type: 'PushRecordListModel/remove',
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
      let values = {
        ...fieldsValue,
      };
      if (values.createTime && values.createTime.startTime) {
        values.begTime = values.createTime.startTime;
        values.endTime = values.createTime.endTime;
      }
      this.setState({
        formValues: values,
      });
      this.getReloadList({ ...values, pageIndex: 1 });
    });
  };

  handleModalVisible = (flag, type) => {
    let updateData = { modalVisible: !!flag };

    if (type) {
      updateData.type = type;
      //  this.setState({editRoleDate:{}})
    }
    this.setState({
      ...updateData,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {} } = this.state;

    // console.log('parentID',parentID,fields)
    dispatch({
      type: 'PushRecordListModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        message.success('推送成功');
        this.handleModalVisible();
      },
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { modeList = [] } = this.state;
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
            <FormItem label="内容">
              {getFieldDecorator('content')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="时间段">
              {getFieldDecorator('createTime')(<CustomRangePicker />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      PushRecordListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
      type,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; //分配系统平台列表
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
                buttonKey.PushAppointMessage,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.PushAppointMessage) ||
                    'plus'
                  }
                  onClick={() => this.handleModalVisible(true, 'SendPush')}
                >
                  推送指定用户
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.PushAllMessage,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.PushAllMessage) || 'plus'
                  }
                  onClick={() => this.handleModalVisible(true, 'AllSendPush')}
                >
                  推送所有用户消息
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.PushMessage,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.PushMessage) || 'pushpin'
                  }
                  onClick={() => this.pushMessgae({}, 'push')}
                >
                  推送消息
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.UndoPush) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.UndoPush) || 'close'}
                  onClick={() => this.pushMessgae({}, 'withdraw')}
                >
                  撤销推送
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
        {modalVisible && type ? (
          <CreateForm
            {...parentMethods}
            modalVisible={modalVisible}
            editRoleDate={editRoleDate}
            type={type}
          />
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
