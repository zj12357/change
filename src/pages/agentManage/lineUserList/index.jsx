import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Select,
  message,
  Modal,
  Dropdown,
  Menu,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import CustomRangePicker from '@/components/Picker/CustomRangePicker.jsx';
import UserInfo from './components/UserInfo.jsx';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};

/* eslint react/no-multi-comp:0 */
@connect(({ lineUserListModel, loading, login }) => ({
  lineUserListModel,
  login,
  loading: loading.models.lineUserListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    userVisible: false,
    sysPermissionList: [],
    parentID: '',
    rangeTextList: [],
    CategoryRules: [],
    userModalInfo: {},
  };

  columns = [
    {
      title: '用户名称',
      dataIndex: 'userName',
      fixed: 'left',
      width: 140,
      render: (val, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={() => this.handleUserVisible(record.uid, '用户详情', 1)}>
                用户详情
              </Menu.Item>
              <Menu.Item key="2" onClick={() => this.handleUserVisible(record.uid, '存款记录', 2)}>
                存款记录
              </Menu.Item>
              <Menu.Item key="3" onClick={() => this.handleUserVisible(record.uid, '取款记录', 3)}>
                取款记录
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            {val} <Icon type="down" />
          </a>
        </Dropdown>
      ),
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
    },
    {
      title: 'vip等级',
      dataIndex: 'vipLevel',
    },
    {
      title: '代理线',
      dataIndex: 'plName',
    },
    {
      title: '存款金额',
      dataIndex: 'depositAmt',
    },
    {
      title: '取款金额',
      dataIndex: 'withdrawalAmt',
    },
    {
      title: '总输赢',
      dataIndex: 'profitTotal',
    },
    {
      title: '常玩游戏',
      dataIndex: 'playGame',
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      width: 220,
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      width: 220,
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getVipLevelList();
    this.getOftenGames();
    this.getProxyLineList();
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
        let CategoryRules = list.filter(item => item.parentCode === 'CategoryRules');
        this.setState({ CategoryRules });
      },
    });
  };

  getReloadList = params => {
    const {
      dispatch,
      lineUserListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    // console.log('pagination``````````````````',pagination)
    dispatch({
      type: 'lineUserListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...params,
        typeName: '采集用途',
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
        type: 'lineUserListModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(() => {
        this.setState({ updateModalVisible: !!flag });
      });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  enableAccount = record => {
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: 'lineUserListModel/enableAccount',
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
    this.setState({
      formValues: {},
      rangeTextList: [],
    });
    this.getReloadList({ pageIndex: 1 });
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
          type: 'lineUserListModel/remove',
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

  handleUserVisible = (id, val, key) => {
    const { form } = this.props;
    let beginTime = form.getFieldsValue(['lastDepositTime']).lastDepositTime
      ? form.getFieldsValue(['lastDepositTime']).lastDepositTime.startTime
      : '';
    let endTime = form.getFieldsValue(['lastDepositTime']).lastDepositTime
      ? form.getFieldsValue(['lastDepositTime']).lastDepositTime.endTime
      : '';
    this.setState({
      userVisible: true,
      userModalInfo: {
        userModalTitle: val,
        userId: id,
        useTypeKey: key,
        beginTime:
          beginTime ||
          moment()
            .startOf('month')
            .utc(8)
            .format(),
        endTime:
          endTime ||
          moment(new Date())
            .utc(8)
            .format(),
      },
    });
  };
  handleCloseUserVisible = () => {
    this.setState({
      userVisible: false,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {}, parentID } = this.state;

    if (parentID) fields.parentID = parentID;

    dispatch({
      type: 'lineUserListModel/add',
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
  changeRange = val => {
    this.setState({
      rangeTextList: val,
    });
  };
  getVipLevelList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lineUserListModel/vipLevel',
      payload: {},
    });
  };
  getOftenGames = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lineUserListModel/oftenGames',
      payload: {},
    });
  };
  getProxyLineList = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lineUserListModel/proxyLine',
      payload: {
        name: val,
      },
    });
  };
  fetchProxyList = val => {
    this.debounceFun(val);
  };
  //搜索防抖
  debounceFun = _.debounce(function(val) {
    this.getProxyLineList(val);
  }, 700);

  renderSimpleForm() {
    const {
      form,
      lineUserListModel: { data },
    } = this.props;
    const { vipList, gameList } = data;
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
            <FormItem label="用户名称">
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户名称',
                  },
                ],
              })(<Input placeholder="请输入用户名称" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="VIP等级">
              {getFieldDecorator('vipLevel', {
                rules: [
                  {
                    required: false,
                    message: '请选择VIP等级',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  placeholder="请选择VIP等级"
                  // className="tableTop-line"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {vipList.map((item, index) => {
                    return (
                      <Option value={item} key={index}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="常玩游戏">
              {getFieldDecorator('playGame', {
                rules: [
                  {
                    required: false,
                    message: '请选择常玩游戏',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  placeholder="请选择常玩游戏"
                  // className="tableTop-line"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {gameList.map((item, index) => {
                    return (
                      <Option value={item} key={index}>
                        {item}
                      </Option>
                    );
                  })}
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
    const {
      form: { getFieldDecorator },
      lineUserListModel: { data },
    } = this.props;
    const { vipList, gameList, proxyLineList } = data;
    const { CategoryRules, rangeTextList } = this.state;
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
            <FormItem label="用户名称">
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户名称',
                  },
                ],
              })(<Input placeholder="请输入用户名称" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="VIP等级">
              {getFieldDecorator('vipLevel', {
                rules: [
                  {
                    required: false,
                    message: '请选择VIP等级',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  placeholder="请选择VIP等级"
                  // className="tableTop-line"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {vipList.map((item, index) => {
                    return (
                      <Option value={item} key={index}>
                        {item}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="常玩游戏">
              {getFieldDecorator('playGame', {
                rules: [
                  {
                    required: false,
                    message: '请选择常玩游戏',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  placeholder="请选择常玩游戏"
                  // className="tableTop-line"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {gameList.map((item, index) => {
                    return (
                      <Option value={item} key={index}>
                        {item}
                      </Option>
                    );
                  })}
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
            <FormItem {...formItemLayout} label="代理线">
              {getFieldDecorator('proxyLine', {
                rules: [
                  {
                    required: false,
                    message: '请选择代理线',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  mode="multiple"
                  placeholder="请选择代理线"
                  // className="tableTop-line"
                  onSearch={this.fetchProxyList}
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {proxyLineList.map((item, index) => {
                    return (
                      <Option value={item.plid} key={index}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="上次存取款时间">
              {getFieldDecorator('lastDepositTime', {
                rules: [
                  {
                    required: false,
                    message: '请选择上次存款时间',
                  },
                ],
              })(
                <CustomRangePicker
                  defaultDate={{
                    startTime: moment()
                      .startOf('month')
                      .utc(8)
                      .format(),
                    endTime: moment(new Date())
                      .utc(8)
                      .format(),
                  }}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem {...formItemLayout} label="上次在线时间">
              {getFieldDecorator('lastOnlineTime', {
                rules: [
                  {
                    required: false,
                    message: '上次在线时间',
                  },
                ],
              })(<CustomRangePicker />)}
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
            <FormItem {...formItemLayout} label="注册时间">
              {getFieldDecorator('registerTime', {
                rules: [
                  {
                    required: false,
                    message: '请选择注册时间',
                  },
                ],
              })(<CustomRangePicker />)}
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
      lineUserListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
      userModalInfo,
      userVisible,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; //分配权限列表
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisibleRole,
    };
    const userMethods = {
      handleCloseUserVisible: this.handleCloseUserVisible,
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
        {userVisible ? (
          <UserInfo userModalInfo={userModalInfo} {...userMethods} userVisible={userVisible} />
        ) : null}
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
