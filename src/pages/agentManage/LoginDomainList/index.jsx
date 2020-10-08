import { Button, Card, Col, Form, Input, Row, Select, message, Modal, Popover } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon, filterImages } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import { baseUrl } from '@/utils/config.js';
import UpdataCookie from './components/UpdataCookie';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ LoginDomainListModel, loading, login }) => ({
  LoginDomainListModel,
  login,
  loading: loading.models.LoginDomainListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    modalVisibleUpload: false,
    ProxyLineState: [],
    updataCookieStatus: false,
    updataCookieValues: {},
    LoginDomainList: [],
  };

  columns = [
    {
      title: '域名名称',
      dataIndex: 'domainName',
    },
    {
      title: '域名地址',
      dataIndex: 'domainAddress',
      width: 280,
    },

    {
      title: '状态',
      dataIndex: 'stateName',
    },
    {
      title: '代理线名称',
      dataIndex: 'plName',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: 'token',
      dataIndex: 'token',
      width: 120,
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
      width: 120,
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
    this.getStatusList();
    this.getReloadListAll();
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
        let ProxyLineState = list.filter(item => item.parentCode === 'ProxyLineState');
        this.setState({ ProxyLineState });
      },
    });
  };
  getReloadList = params => {
    const {
      dispatch,
      LoginDomainListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;

    dispatch({
      type: 'LoginDomainListModel/fetch',
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
  getReloadListAll = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'LoginDomainListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 200,
      },
      callback: data => {
        //如删除最后一条数据  最后一页没有数据自动往前减一
        const list = data[listId] || [];
        this.setState({ LoginDomainList: list });
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
    this.setState({ editRoleDate: val });
    this.handleModalVisible(true);
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
          type: 'LoginDomainListModel/remove',
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

  handleModalVisible = (flag, type) => {
    let updateData = { modalVisible: !!flag };
    if (type === 'add') {
      updateData.editRoleDate = {};
    }
    this.setState({
      ...updateData,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { parentID } = fields;
    dispatch({
      type: 'LoginDomainListModel/add',
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
      this.getReloadList();
      this.setState({
        updataCookieStatus: !!flag,
        updataCookieValues: {},
      });
    }
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { ProxyLineState, LoginDomainList } = this.state;

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
            <FormItem label="登录状态">
              {getFieldDecorator('loginState')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择登录状态"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {ProxyLineState.map((item, index) => (
                    <Option value={item.code} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="代理线">
              {getFieldDecorator('plid')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择代理线"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {LoginDomainList.map((item, index) => (
                    <Option value={item.plid} key={index}>
                      {item.plName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="域名">
              {getFieldDecorator('cdid')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择域名"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {LoginDomainList.map((item, index) => (
                    <Option value={item.cdid} key={index}>
                      {item.domainName}
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
    if (val.applyState != 'Confirm') {
      this.setState({ editRoleDate: val, modalVisibleUpload: !this.state.modalVisibleUpload });
    } else {
      message.info('该号码已经审核通过！');
    }
  };

  render() {
    const {
      LoginDomainListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      modalVisibleUpload,
      updataCookieStatus,
      updataCookieValues,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const parentMethodsUpload = {
      handleModalVisibleUpload: this.handleModalVisibleUpload,
      getReloadList: this.getReloadList,
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
        ) : null}
        {updataCookieStatus ? (
          <UpdataCookie
            updataCookieStatus={updataCookieStatus}
            handleUpdateCookieModel={this.handleUpdateCookieModel}
            value={updataCookieValues}
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
