import { Button, Card, Col, Form, Input, Row, Select, message, Modal, Icon } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon, filterImages, toMoney, toPercentInt } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';
import lodash from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ GetProxyTodayReportModel, loading, login }) => ({
  GetProxyTodayReportModel,
  login,
  loading: loading.models.GetProxyTodayReportModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    expandForm: false,
    ProxyLineGroup: [],
    DataAnalysisUserType: [],
    proxyLineList: [],
  };

  columns = [
    {
      title: '代理线',
      dataIndex: 'plName',
      fixed: 'left',
      width: 120,
    },
    {
      title: '总用户',
      dataIndex: 'plAllUserQty',
      sorter: (a, b) => a.plAllUserQty - b.plAllUserQty,
    },
    {
      title: '月充值',
      dataIndex: 'mDepUserQty',
      sorter: (a, b) => a.mDepUserQty - b.mDepUserQty,
    },
    {
      title: '充值4+',
      dataIndex: 'mDep4UserQty',
      sorter: (a, b) => a.mDep4UserQty - b.mDep4UserQty,
    },
    {
      title: '日新增',
      dataIndex: 'dAddUserQty',
      sorter: (a, b) => a.dAddUserQty - b.dAddUserQty,
    },
    {
      title: '7日留存',
      dataIndex: 'd7ActUserQty',
      sorter: (a, b) => a.d7ActUserQty - b.d7ActUserQty,
    },
    {
      title: '昨7日留存',
      dataIndex: 'd8ActUserQty',
      sorter: (a, b) => a.d8ActUserQty - b.d8ActUserQty,
    },
    {
      title: '15日留存',
      dataIndex: 'd15ActUserQty',
      sorter: (a, b) => a.d15ActUserQty - b.d15ActUserQty,
    },
    {
      title: '昨15日留存',
      dataIndex: 'd16ActUserQty',
      sorter: (a, b) => a.d16ActUserQty - b.d16ActUserQty,
    },
    {
      title: '日在线',
      dataIndex: 'dOnLineUserQty',
      sorter: (a, b) => a.dOnLineUserQty - b.dOnLineUserQty,
    },
    {
      title: '昨在线',
      dataIndex: 'bdOnLineUserQty',
      sorter: (a, b) => a.bdOnLineUserQty - b.bdOnLineUserQty,
    },

    {
      title: '在线率',
      dataIndex: 'dOnLineRate',
      render: value => <span className="textColor">{toPercentInt(value)}</span>,
      sorter: (a, b) => a.dOnLineRate - b.dOnLineRate,
    },
    {
      title: '月新增',
      dataIndex: 'mAddUserQty',
      sorter: (a, b) => a.mAddUserQty - b.mAddUserQty,
    },
    {
      title: '月活跃',
      dataIndex: 'mActUserQty',
      sorter: (a, b) => a.mActUserQty - b.mActUserQty,
    },
    {
      title: '月超级活跃',
      dataIndex: 'msActUserQty',
      sorter: (a, b) => a.msActUserQty - b.msActUserQty,
    },
    {
      title: '月活率',
      dataIndex: 'mActUserRate',
      render: value => <span className="textColor">{toPercentInt(value)}</span>,
      sorter: (a, b) => a.mActUserRate - b.mActUserRate,
    },
    {
      title: '日复充',
      dataIndex: 'dmDepQty',
      sorter: (a, b) => a.dmDepQty - b.dmDepQty,
    },
    {
      title: '日存款',
      dataIndex: 'dDepAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.dDepAmt - b.dDepAmt,
    },
    {
      title: '日提款',
      dataIndex: 'dWitAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.dWitAmt - b.dWitAmt,
    },
    {
      title: '日流水',
      dataIndex: 'dBetsAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.dBetsAmt - b.dBetsAmt,
    },
    {
      title: '日输赢',
      dataIndex: 'dProAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.dProAmt - b.dProAmt,
    },
    {
      title: '日均存款',
      dataIndex: 'dAvgDepAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.dAvgDepAmt - b.dAvgDepAmt,
    },
    {
      title: '日均输赢',
      dataIndex: 'dayAvgProfitAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.dayAvgProfitAmt - b.dayAvgProfitAmt,
    },
    {
      title: '日均流水',
      dataIndex: 'dAvgBetsAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.dAvgBetsAmt - b.dAvgBetsAmt,
    },
    {
      title: '月复充',
      dataIndex: 'mMulDepUserQty',
      sorter: (a, b) => a.mMulDepUserQty - b.mMulDepUserQty,
    },
    {
      title: '月存款',
      dataIndex: 'mDepAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.mDepAmt - b.mDepAmt,
    },
    {
      title: '月提款',
      dataIndex: 'mWitAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.mWitAmt - b.mWitAmt,
    },
    {
      title: '月流水',
      dataIndex: 'mBetsAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.mBetsAmt - b.mBetsAmt,
    },
    {
      title: '月输赢',
      dataIndex: 'mProAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.mProAmt - b.mProAmt,
    },
    {
      title: '流水比例',
      dataIndex: 'mBetsRate',
      render: value => <span className={value < 5 ? 'textColor' : ''}>{value}</span>,
      sorter: (a, b) => a.mBetsRate - b.mBetsRate,
    },
    {
      title: '流水杀率',
      dataIndex: 'mBetsKillRate',
      render: value => (
        <span className={value < 0.03 ? 'textColor' : ''}>{toPercentInt(value)}</span>
      ),
      sorter: (a, b) => a.mBetsKillRate - b.mBetsKillRate,
    },
    {
      title: '存款杀率',
      dataIndex: 'mDepRate',
      render: value => (
        <span className={value < 0.03 ? 'textColor' : ''}>{toPercentInt(value)}</span>
      ),
      sorter: (a, b) => a.mDepRate - b.mDepRate,
    },
    {
      title: '月均存款',
      dataIndex: 'mDepAvgAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.mDepAvgAmt - b.mDepAvgAmt,
    },
    {
      title: '月均输赢',
      dataIndex: 'mProAvgAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.mProAvgAmt - b.mProAvgAmt,
    },
    {
      title: '月均流水',
      dataIndex: 'mBetsAvgAmt',
      render: val => (val ? toMoney(val) : 0),
      sorter: (a, b) => a.mBetsAvgAmt - b.mBetsAvgAmt,
    },
    {
      title: '月在线',
      dataIndex: 'mOnLineUserQty',
      sorter: (a, b) => a.mOnLineUserQty - b.mOnLineUserQty,
    },
    {
      title: '日存款人数',
      dataIndex: 'dDepUserQty',
      sorter: (a, b) => a.dDepUserQty - b.dDepUserQty,
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getStatusList();
    this.getLineList();
  }

  getReloadList = params => {
    const {
      dispatch,
      GetProxyTodayReportModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;

    dispatch({
      type: 'GetProxyTodayReportModel/fetch',
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
        let ProxyLineGroup = list.filter(item => item.parentCode === 'ProxyLineGroup');
        let DataAnalysisUserType = list.filter(item => item.parentCode === 'DataAnalysisUserType');
        this.setState({ ProxyLineGroup, DataAnalysisUserType });
      },
    });
  };

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
        type: 'GetProxyTodayReportModel/getResourceByAdminIdServe',
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
      type: 'GetProxyTodayReportModel/update',
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
      type: 'GetProxyTodayReportModel/enableAccount',
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
          type: 'GetProxyTodayReportModel/remove',
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
      type: 'GetProxyTodayReportModel/add',
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
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { ProxyLineGroup, proxyLineList } = this.state;
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
            <FormItem label="代理分组">
              {getFieldDecorator('groupId')(
                <Select style={{ width: '100%' }} placeholder="请选择代理分组">
                  {ProxyLineGroup.map((item, index) => (
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
            <FormItem label="日期">
              {getFieldDecorator('ldate', {
                rules: [
                  {
                    required: false,
                    message: '请选择日期',
                  },
                ],
                initialValue: new Date(),
              })(<CustomDatePicker format={'YYYY-MM-DD'} />)}
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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { ProxyLineGroup, DataAnalysisUserType, proxyLineList } = this.state;
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
            <FormItem label="代理分组">
              {getFieldDecorator('groupId')(
                <Select style={{ width: '100%' }} placeholder="请选择代理分组">
                  {ProxyLineGroup.map((item, index) => (
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
            <FormItem label="日期">
              {getFieldDecorator('ldate', {
                rules: [
                  {
                    required: false,
                    message: '请选择日期',
                  },
                ],
                initialValue: new Date(),
              })(<CustomDatePicker format={'YYYY-MM-DD'} />)}
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
            <FormItem label="用户名称">
              {getFieldDecorator('userName')(<Input placeholder="请输入用户名称" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('userType')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {DataAnalysisUserType.map((item, index) => (
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

  render() {
    const {
      GetProxyTodayReportModel: { data },
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
