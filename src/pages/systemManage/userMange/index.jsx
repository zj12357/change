import { Button, Card, Col, Form, Icon, Input, Row, Select, message, Modal } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import ChangePassword from './components/ChangePassword';
import PermissionList from './components/PermissionList';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon, flatArrs } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import { Spin } from 'antd';
import debounce from 'lodash/debounce';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ userMangeModel, loading, login }) => ({
  userMangeModel,
  login,
  loading: loading.models.userMangeModel,
  searchTeamLoading: loading.effects['departmentModel/fetch'],
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    ChangePassDate: {},
    isChangePass: false,
    PermissionListData: {},
    PermissionListStatus: false,
    teamList: [],
    UserState: [],
    UserLoginState: [],
  };

  columns = [
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户备注',
      dataIndex: 'remark',
    },
    {
      title: '手机',
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },

    {
      title: '是否在线',
      dataIndex: 'isOnline',
      render: val => (val ? '在线' : '离线'),
    },
    {
      title: '用户状态',
      dataIndex: 'stateName',
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getStatusList();
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
        let UserState = list.filter(item => item.parentCode === 'UserState');
        let UserLoginState = list.filter(item => item.parentCode === 'UserOnlineStatus');
        this.setState({ UserState, UserLoginState });
      },
    });
  };

  getReloadList = params => {
    const {
      dispatch,
      userMangeModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;

    dispatch({
      type: 'userMangeModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...this.state.formValues,
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
  handleUpdateModalVisible = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    this.setState({ editRoleDate: record, modalVisible: true });
  };

  handleUpdateModalVisibleRole = (flag, record) => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];

    this.setState({
      stepFormValues: record || {},
    });
    this.setState({ updateModalVisible: !!flag });
  };

  updataPermissionListStatus = flag => {
    this.setState({ PermissionListStatus: !!flag });
  };

  changePass = record => {
    // isChangePass
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    this.setState({
      ChangePassDate: record || {},
    });
    this.upDatePass(true);
  };

  upDatePass = flag => {
    this.setState({
      isChangePass: !!flag,
    });
  };

  //更新"用户"用户
  handleUpdate = fields => {
    const { dispatch } = this.props;
    console.log(fields, 'fields');
    dispatch({
      type: 'userMangeModel/update',
      payload: fields,
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
    const { userID, stateName } = record;
    //stateName === '正常'?
    dispatch({
      type: 'userMangeModel/enableAccount',
      payload: {
        userID,
        stateName,
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
      () => {
        this.getReloadList({ pageIndex: 1 });
      },
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
          type: 'userMangeModel/remove',
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

      this.setState({
        formValues: values,
      });
      this.getReloadList({ ...values, pageIndex: 1 });
    });
  };

  handleModalVisible = flag => {
    this.setState({ editRoleDate: {}, modalVisible: !!flag });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMangeModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        this.setState({ selectedRows: [] });
        message.success(fields[keysID] ? '修改成功' : '添加成功');
        this.handleModalVisible();
      },
    });
  };

  getSerachTeamList = name => {
    if (!name) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        name,
      },
      callback: data => {
        this.setState({ teamList: flatArrs(data.deptList || []) });
      },
    });
  };

  renderSimpleForm() {
    const { form, searchTeamLoading } = this.props;
    const { getFieldDecorator } = form;
    const { teamList = [] } = this.state;
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
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('deptName')(
                <Select
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  notFoundContent={searchTeamLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={debounce(this.getSerachTeamList, 1000)}
                  style={{ width: '100%' }}
                  placeholder="请输入部门名称搜索用户"
                  loading={searchTeamLoading}
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {teamList.map(item => (
                    <Option value={item.name} key={item.name}>
                      {item.name}
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
            展开 <Icon type="down" />
          </a>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form, searchTeamLoading } = this.props;
    const { getFieldDecorator } = form;
    const { teamList = [], UserState, UserLoginState } = this.state;

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
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('deptName')(
                <Select
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  notFoundContent={searchTeamLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={debounce(this.getSerachTeamList, 1000)}
                  style={{ width: '100%' }}
                  placeholder="请输入部门名称搜索用户"
                  loading={searchTeamLoading}
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {teamList.map(item => (
                    <Option value={item.name} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
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
            <FormItem label="状态">
              {getFieldDecorator('stateID')(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  {UserState.map((item, index) => (
                    <Option value={item.code} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="是否在线">
              {getFieldDecorator('isOnline')(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  {UserLoginState.map((item, index) => (
                    <Option value={Boolean(Number(item.code))} key={index}>
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
      userMangeModel: { data },
      loading,
    } = this.props;

    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
      isChangePass,
      ChangePassDate,
      PermissionListData,
      PermissionListStatus,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; //分配"用户列表
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

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.DistributionRole,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.DistributionRole) ||
                    'border-bottom'
                  }
                  onClick={() => this.handleUpdateModalVisibleRole(true)}
                >
                  分配角色
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Frozen) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Frozen) || 'eye'}
                  onClick={() => this.enableAccount()}
                >
                  冻结解冻用户
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.EditPassword,
              ) ? (
                <Button
                  type="primary"
                  icon="database"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.EditPassword) || 'database'
                  }
                  onClick={() => this.changePass()}
                >
                  修改密码
                </Button>
              ) : (
                false
              )}

              {/* {filtEleBtn(this.props.login.sysUserPermissionList, menuText,buttonKey.Delete) ? (
                <Button
                  type="primary"
                  icon="delete"
                  onClick={() => this.handleMenuClick('itemDelete')}
                >
                  删除
                </Button>
              ) : false}*/}

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

        <ChangePassword
          modalVisible={isChangePass}
          editRoleDate={ChangePassDate}
          upDatePass={this.upDatePass}
        />

        {updateModalVisible && stepFormValues.userID ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            allResourcesList={allResourcesList}
            yelResourcesList={yelResourcesList}
          />
        ) : null}

        {PermissionListData.userID && PermissionListStatus ? (
          <PermissionList
            updateModalVisible={PermissionListStatus}
            PermissionListData={PermissionListData}
            updataPermissionListStatus={this.updataPermissionListStatus}
          />
        ) : (
          false
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
