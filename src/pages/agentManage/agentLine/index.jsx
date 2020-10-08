import { Button, Card, Col, Form, Input, Row, Select, message, Modal, Popover } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import UpdataCookie from './components/UpdataCookie';
import HyperlinksList from './components/HyperlinksList';
import ProxyGroup from './components/ProxyGroup';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import LandingPageDomain from './components/LandingPageDomain.jsx';
import router from 'umi/router';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ agentLineModel, loading, login }) => ({
  agentLineModel,
  login,
  loading: loading.models.agentLineModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updataCookieValues: {},
    UpdateHyperlinksStatus: false,
    UpdateHyperlinksValues: {},
    updateModalVisible: false,
    updataCookieStatus: false,
    updateGroupVisible: false,
    LandingPageVisible: false,
    type: '', // userAssignment (用户分配)  landingPageDomain (落地页域名分配)  ProxyCollectionLine(采集器分配)
  };

  columns = [
    {
      title: '代理线名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 140,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    // {
    //   title: '分组名称',
    //   dataIndex: 'groupName',
    // },
    {
      title: '登陆状态',
      dataIndex: 'loginStatus',
      render: (value, record) => (
        <p>
          <a onClick={() => this.handleUpdateHyperlinks(true, record)}>{value}</a>
        </p>
      ),
    },
    {
      title: '代理类型',
      dataIndex: 'proxyTypeName',
    },
    {
      title: '负责人',
      dataIndex: 'principalUserName',
    },

    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 220,
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '域名cookie',
      dataIndex: 'token',
      render: val =>
        val ? (
          <Popover
            content={
              <p style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{val}</p>
            }
            title="查看token"
            trigger="click"
          >
            <Button type="primary">查看token</Button>
          </Popover>
        ) : null,
    },
    {
      title: 'cookie',
      dataIndex: 'cookie',
      render: val =>
        val ? (
          <Popover
            content={
              <p style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{val}</p>
            }
            title="查看cookie"
            trigger="click"
          >
            <Button type="primary">查看cookie</Button>
          </Popover>
        ) : null,
    },
  ];

  componentDidMount() {
    this.getReloadList();
  }

  AddLandingPageDomain = record => {
    router.push(`/agentManage/AddLandingPageDomain?id=${record.plid}`);
  };

  handleUpdateHyperlinks = (flag, record) => {
    this.setState({
      UpdateHyperlinksStatus: !!flag,
      UpdateHyperlinksValues: record || {},
    });
  };

  getReloadList = params => {
    const {
      dispatch,
      agentLineModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'agentLineModel/fetch',
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

  handleUpdateCookieModel = (flag, record) => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    if (flag) {
      this.setState({
        updataCookieStatus: !!flag,
        updataCookieValues: record || {},
      });
    } else {
      this.setState({
        updataCookieStatus: !!flag,
        updataCookieValues: {},
      });
    }
  };
  handleUpdateModalVisibleRole = (flag, record, type) => {
    const { dispatch } = this.props;
    if (type) {
      const { selectedRows = [] } = this.state;
      if (Array.isArray(selectedRows) && selectedRows.length === 1) {
      } else {
        message.error('请选择并且只能选择一项数据！');
        return false;
      }
      record = selectedRows[0];
    }
    this.setState({
      stepFormValues: record || {},
      type,
      updateModalVisible: !!flag,
    });
  };
  handlelandingModalVisibleRole = (flag, record, type) => {
    const { dispatch } = this.props;
    if (type) {
      const { selectedRows = [] } = this.state;
      if (Array.isArray(selectedRows) && selectedRows.length === 1) {
      } else {
        message.error('请选择并且只能选择一项数据！');
        return false;
      }
      record = selectedRows[0];
    }
    this.setState({
      stepFormValues: record || {},
      type,
      LandingPageVisible: !!flag,
    });
  };
  //更新"用户"用户
  handleUpdate = fields => {
    const { dispatch } = this.props;
    // console.log(fields, 'fields');
    dispatch({
      type: 'agentLineModel/update',
      payload: fields,
      callback: () => {
        message.success('分配成功');
        this.handleUpdateModalVisibleRole();
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
          type: 'agentLineModel/remove',
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
      if (values.isOnline) {
        values.isOnline = values.isOnline === 'true' ? true : false;
      }

      this.setState({
        formValues: values,
      });
      this.getReloadList({ ...values, pageIndex: 1 });
    });
  };

  handleModalVisible = (flag, type) => {
    if (type === 'add') {
      this.setState({ editRoleDate: {} });
    }
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {} } = this.state;
    dispatch({
      type: 'agentLineModel/add',
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

  handleUpdateGroup = () => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    let val = selectedRows[0];
    this.setState({ editRoleDate: val, updateGroupVisible: !this.state.updateGroupVisible });
  };
  renderForm() {
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
          <Col md={6} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="员工名称">
              {getFieldDecorator('realName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      agentLineModel: { data },
      loading,
    } = this.props;

    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
      type,
      updataCookieStatus,
      updataCookieValues,
      updateGroupVisible,
      LandingPageVisible,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisibleRole,
      handleUpdate: this.handleUpdate,
      handlelandingModalVisibleRole: this.handlelandingModalVisibleRole,
    };

    const updateGroupMethods = {
      handleUpdateGroup: this.handleUpdateGroup,
    };
    const { login } = this.props;
    const sysUserPermissionList = login.sysUserPermissionList || [];
    // console.log('updataCookieStatus',updataCookieStatus)

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

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.BindingCollector,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.BindingCollector) ||
                    'project'
                  }
                  onClick={() => this.handleUpdateModalVisibleRole(true, {}, 'ProxyCollectionLine')}
                >
                  绑定采集器
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.BindUser) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.BindUser) || 'user'}
                  onClick={() => this.handleUpdateModalVisibleRole(true, {}, 'userAssignment')}
                >
                  绑定用户
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.DistributionDomain,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.DistributionDomain) ||
                    'apartment'
                  }
                  onClick={() => this.handlelandingModalVisibleRole(true, {}, 'landingPageDomain')}
                >
                  域名分配
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.SignIn) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.SignIn) || 'login'}
                  onClick={() => this.handleUpdateCookieModel(true, {})}
                >
                  登录
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.ProxyGroup,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.ProxyGroup) ||
                    'usergroup-add'
                  }
                  onClick={() => this.handleUpdateGroup()}
                >
                  分组管理
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
                  <Button icon="delete" type="danger" onClick={this.handleMenuClick}>批量删除</Button>

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
            type={type}
          />
        ) : null}
        {LandingPageVisible ? (
          <LandingPageDomain
            {...updateMethods}
            updateModalVisible={LandingPageVisible}
            values={stepFormValues}
            type={type}
          />
        ) : null}

        {updataCookieStatus ? (
          <UpdataCookie
            updataCookieStatus={updataCookieStatus}
            handleUpdateCookieModel={this.handleUpdateCookieModel}
            value={updataCookieValues}
          />
        ) : null}

        {HyperlinksList && this.state.UpdateHyperlinksValues[keysID] ? (
          <HyperlinksList
            updataCookieStatus={this.state.UpdateHyperlinksStatus}
            handleUpdateCookieModel={this.handleUpdateHyperlinks}
            value={this.state.UpdateHyperlinksValues}
          />
        ) : null}
        {updateGroupVisible ? (
          <ProxyGroup
            updateGroupVisible={updateGroupVisible}
            editRoleDate={editRoleDate}
            {...updateGroupMethods}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
