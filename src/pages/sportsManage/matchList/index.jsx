import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Modal,
} from 'antd';
import React, { Component, Fragment } from 'react';
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
import router from 'umi/router';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

function filtArea(key) {
  return (
    {
      0: '洲',
      1: '国',
      2: '城市',
    }[key] || '未知'
  );
}

// 显示预测记录
function filtForecast(status) {
  return (
    {
      null: '未关联',
      0: '未中',
      1: '中',
    }[status] || '未关联'
  );
}

function filtStatleColour(gameStatus) {
  const colorType = {
    0: 'black',
    1: 'green',
    2: 'red',
  };
  return colorType[gameStatus] || 'black';
}

function filtStatus(gameStatus) {
  const typeNmae = {
    0: '未开赛',
    1: '开赛',
    2: '半场结束',
    3: '下半场开始',
    4: '比赛结束',
    5: '推迟',
    6: '待定',
    7: '加时',
  };
  return typeNmae[gameStatus] || '';
}

/* eslint react/no-multi-comp:0 */
@connect(({ matchListModel, loading, login }) => ({
  matchListModel,
  login,
  loading: loading.models.matchListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    IntelligenceStatus:[],
    MatchStatus:[]
  };

  columns = [
    {
      title: '赛事名称',
      width: 300,
      fixed: 'left',
      dataIndex: 'name',
    },
    {
      title: '赛事编号',
      dataIndex: 'id',
    },
    {
      title: '联赛名称',
      dataIndex: 'leagueByName',
    },
    {
      title: '主队名称',
      dataIndex: 'homeTeamName',
    },
    {
      title: '客队名称',
      dataIndex: 'visitingTeamName',
    },
    {
      title: '赛事时间',
      width: 220,
      dataIndex: 'gameDate',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '赛事状态',
      dataIndex: 'gameStatus',
      render: val => <span style={{ color: filtStatleColour(val) }}>{filtStatus(val)}</span>,
    },
    {
      title: '预测状态',
      dataIndex: 'predictionStatus',
      render: val => filtForecast(val),
    },

    {
      title: '国家名称',
      dataIndex: 'countryByName',
    },
    {
      title: '比分',
      dataIndex: 'score',
    },
    {
      title: '角球',
      dataIndex: 'cornerKick',
    },
    {
      title: '黄牌',
      dataIndex: 'yellowCard',
    },
    {
      title: '红牌',
      dataIndex: 'redCard',
    },
  ];

  componentDidMount() {
    this.getReloadList();
    this.getStatusList()
  }
  //查看预测
  viewForecast = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    if (!record.predictionStatus && record.predictionStatus !== 0) {
      message.error('未关联预测记录！');
      return false;
    }
    router.push(`/sportsManage/PredictionRecordList?id=${record.id}`);
  };
  //查看情报
  viewCutting = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    router.push(`/sportsManage/InformationList?id=${record.id}`);
  };
  //查看赔率
  viewOdds = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    this.handleUpdateModalVisibleRole(true, record);
  };

  renderMenu = record => {
    return (
      <Menu>
        {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.ViewForecast) ? (
          <Menu.Item>
            <a onClick={() => this.viewForecast(record)}>查看预测</a>
          </Menu.Item>
        ) : (
          false
        )}
        {filtEleBtn(
          this.props.login.sysUserPermissionList,
          menuText,
          buttonKey.ViewIntelligence,
        ) ? (
          <Menu.Item>
            <a onClick={() => this.viewCutting(record)}>查看情报</a>
          </Menu.Item>
        ) : (
          false
        )}
        {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.ViewOdds) ? (
          <Menu.Item>
            <a onClick={() => this.viewOdds(record)}>查看赔率</a>
          </Menu.Item>
        ) : (
          false
        )}
      </Menu>
    );
  };

  getReloadList = params => {
    const {
      dispatch,
      matchListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'matchListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
      },
      callback: data => {
        this.setState({ selectedRows: [] });
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
        showType: 3
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let IntelligenceStatus = list.filter(item => item.parentCode === 'IntelligenceStatus');
        let MatchStatus = list.filter(item => item.parentCode === 'MatchStatus');
        this.setState({ IntelligenceStatus,MatchStatus });
      },
    });

  };

  chatRoomManage = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { chatRoom } = record;
    if (!chatRoom) {
      message.error('还没有创建聊天室！');
      return false;
    }
    router.push(`/chatRoomManage/charRoomDetails?id=${encodeURIComponent(chatRoom)}`);
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
      updateModalVisible: !!flag,
    });
  };

  //更新赛事赛事
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个赛事');
      return false;
    }
    dispatch({
      type: 'matchListModel/update',
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
      type: 'matchListModel/enableAccount',
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
          type: 'matchListModel/remove',
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
        values.startDate = values.createTime.startTime;
        values.endDate = values.createTime.endTime;
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
      type: 'matchListModel/add',
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
            <FormItem label="赛事编号">
              {getFieldDecorator('id')(
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="赛事名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="球队名称">
              {getFieldDecorator('teamName')(<Input placeholder="请输入" />)}
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
    const {IntelligenceStatus,MatchStatus} = this.state
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
            <FormItem label="赛事编号">
              {getFieldDecorator('id')(
                <InputNumber placeholder="请输入" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="赛事名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="球队名称">
              {getFieldDecorator('teamName')(<Input placeholder="请输入" />)}
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
          {/* startDate  endDate */}
          <Col md={7} sm={24}>
            <FormItem label="时间段">
              {getFieldDecorator('createTime')(<CustomRangePicker />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="是否有情报">
              {getFieldDecorator('isInfo')(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  {
                    IntelligenceStatus.map((item,index)=> <Option value={Boolean(Number(item.code))} key={index}>{item.displayName}</Option>)
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="赛事状态">
              {getFieldDecorator('status')(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  {
                    MatchStatus.map((item,index)=> <Option value={Number(item.code)} key={index}>{item.displayName}</Option>)
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
      matchListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; //分配赛事列表
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

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.ChatRoomManage,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.ChatRoomManage) ||
                    'menu-unfold'
                  }
                  onClick={() => this.chatRoomManage()}
                >
                  聊天室管理
                </Button>
              ) : (
                false
              )}

              <Dropdown overlay={() => this.renderMenu({})}>
                <Button type="primary" icon="down" onClick={e => e.preventDefault()}>
                  更多
                </Button>
              </Dropdown>

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '删除') ? (
                <Button
                  type="primary"
                  icon="delete"
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

        {updateModalVisible ? (
          <UpdateForm
            updataCookieStatus={updateModalVisible}
            handleUpdateCookieModel={this.handleUpdateModalVisibleRole}
            value={stepFormValues}
            getReloadList={this.getReloadList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
