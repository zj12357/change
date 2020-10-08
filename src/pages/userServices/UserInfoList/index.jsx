import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
  message,
  Modal,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import ReaetPassword from './components/ReaetPassword';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon, filterImages } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import CustomRangePicker from '@/components/Picker/CustomRangePicker.jsx';
import ImManage from './components/ImManage';
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
@connect(({ UserInfoListModel, loading, login }) => ({
  UserInfoListModel,
  login,
  loading: loading.models.UserInfoListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    updataPasswordStatus: false,
    passValue: {},
    imValue: {},
    imVisible: false,
    RegisterDeviceStatus: [],
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '手机',
      dataIndex: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: val => (val ? '男' : '女'),
    },
    {
      title: '用户状态',
      dataIndex: 'blocked',
      render: val => (val === -1 ? '冻结' : '正常'),
    },
    {
      title: '地区',
      dataIndex: 'region',
    },
    {
      title: '累计登陆次数',
      dataIndex: 'logNumber',
    },
    {
      title: '注册设备',
      dataIndex: 'registeredPlant',
    },
    {
      title: '上次登陆时间',
      dataIndex: 'lastTime',
      width: 220,
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '注册Ip',
      dataIndex: 'ip',
    },
    {
      title: '注册时间',
      width: 220,
      dataIndex: 'registerTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getStatusList();
  }

  upDatePass = (flag, record) => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    this.setState({ updataPasswordStatus: !!flag, passValue: record || {} });
  };

  getReloadList = params => {
    const {
      dispatch,
      UserInfoListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'UserInfoListModel/fetch',
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
        let RegisterDeviceStatus = list.filter(item => item.parentCode === 'RegisterDeviceStatus');
        this.setState({ RegisterDeviceStatus });
      },
    });
  };

  renderMenu = record => {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.addIM(true, {}, 'verificationIM')}>添加IM</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.deleteIM({})}>删除IM</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.loginInvalidIM({})}>IM登录账号失效</a>
        </Menu.Item>
      </Menu>
    );
  };
  addIM = (flag, record, type) => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    if (type === 'verificationIM') {
      const { dispatch } = this.props;
      dispatch({
        type: 'UserInfoListModel/verificationIM',
        payload: {
          checkItem: [{ userID: String(record.name) }],
        },
        callback: () => {
          this.setState({
            imValue: record || {},
            imVisible: !!flag,
          });
        },
      });
    } else {
      this.setState({
        imValue: record || {},
        imVisible: !!flag,
      });
    }
  };
  deleteIM = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;
    Modal.confirm({
      title: '删除',
      content: '您确定要删除删除IM嘛?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'UserInfoListModel/DeleteIMs',
          payload: {
            deleteItem: [
              {
                userID: String(record.name),
              },
            ],
          },
          callback: () => {
            message.success('删除IM成功');
          },
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  loginInvalidIM = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;
    Modal.confirm({
      title: '设置',
      content: '您确定要设置登录帐号失效嘛?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'UserInfoListModel/DownLines',
          payload: {
            identifier: String(record.name),
          },
          callback: () => {
            message.success('设置登IM录帐号失效成功');
          },
        });
      },
      onCancel() {
        // console.log('Cancel');
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
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;

    this.setState({
      stepFormValues: record || {},
    });
    if (!!flag) {
      this.setState({ updateModalVisible: !!flag });
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
      type: 'UserInfoListModel/update',
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
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: 'UserInfoListModel/enableAccount',
      payload: {
        uid: id,
        blocked: record.blocked ? -1 : 0,
      },
      callback: () => {
        this.getReloadList();
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
          type: 'UserInfoListModel/remove',
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
      type: 'UserInfoListModel/add',
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
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="注册IP">
              {getFieldDecorator('ip')(<Input placeholder="请输入" />)}
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
    const { RegisterDeviceStatus } = this.state;
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
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="注册IP">
              {getFieldDecorator('ip')(<Input placeholder="请输入" />)}
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
            <FormItem label="时间段">
              {getFieldDecorator('createTime')(<CustomRangePicker />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="注册设备">
              {getFieldDecorator('registeredPlant')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {RegisterDeviceStatus.map((item, index) => (
                    <Option value={Number(item.code)} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
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
      UserInfoListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
      updataPasswordStatus,
      passValue,
      imValue,
      imVisible,
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

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Edit) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Edit) || 'edit'}
                  onClick={() => this.handleUpdateModalVisible({})}
                >
                  编辑
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Details) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.Details) || 'menu-unfold'
                  }
                  onClick={() => this.handleUpdateModalVisibleRole(true, {})}
                >
                  详情
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.FreezeUnfreezeUsers,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.FreezeUnfreezeUsers) ||
                    'border-bottom'
                  }
                  onClick={() => this.enableAccount({})}
                >
                  冻结解冻用户
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.ResetPassword,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.ResetPassword) || 'logout'
                  }
                  onClick={() => this.upDatePass(true, {})}
                >
                  重置密码
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.IMManage) ? (
                <Dropdown overlay={() => this.renderMenu({})}>
                  <Button
                    type="primary"
                    icon={takeIcon(this.props.login.dictionaryList, buttonKey.IMManage) || 'down'}
                    onClick={e => e.preventDefault()}
                  >
                    IM管理
                  </Button>
                </Dropdown>
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
            <ImManage
              modalVisible={imVisible}
              editRoleDate={imValue}
              handleModalVisible={this.addIM}
            />

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

        {updataPasswordStatus ? (
          <ReaetPassword
            modalVisible={updataPasswordStatus}
            passValue={passValue}
            upDatePass={this.upDatePass}
          />
        ) : (
          false
        )}

        {stepFormValues && updateModalVisible && Object.keys(stepFormValues).length ? (
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
