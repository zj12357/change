import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  InputNumber,
  Row,
  Select,
  message,
  Modal,
  Popover,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { filtEleBtn, takeIcon } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import CustomRangePicker from '@/components/Picker/CustomRangePicker.jsx';

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

function filtTipes(key) {
  return (
    {
      '1': '主胜',
      X: '平局 ',
      '2': '客胜',
    }[key] || ''
  );
}

/* eslint react/no-multi-comp:0 */
@connect(({ PredictionRecordListModel, loading, login }) => ({
  PredictionRecordListModel,
  login,
  loading: loading.models.PredictionRecordListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    competitionById: null,
    PredictionStatus: [],
    BindState: [],
  };

  columns = [
    {
      title: '联赛名称',
      width: 290,
      fixed: 'left',
      dataIndex: 'leagueByName',
    },
    {
      title: '赛事时间',
      dataIndex: 'createTime',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '赛事编号',
      dataIndex: 'competitionById',
    },
    {
      title: '主队名称',
      width: 300,
      dataIndex: 'homeTeamName',
    },
    {
      title: '客队名称',
      width: 300,
      dataIndex: 'visitingTeamName',
    },
    {
      title: '绑定状态',
      dataIndex: 'bindStatus',
      render: val => (val ? '已绑定' : '未绑定'),
    },
    {
      title: '预测结果',
      dataIndex: 'predictionStatus',
      render: val => (val ? '命中' : '未中'),
    },
    {
      title: '推荐',
      dataIndex: 'tips',
      render: val => filtTipes(val),
    },
    {
      title: '结果预测',
      dataIndex: 'outcome',
      width: 200,
      render: val =>
        val ? (
          <Popover content={'示例:格式：63%;21%;16% ,（主胜；平局 ；客胜）'} title="示例">
            <a>{val}</a>
          </Popover>
        ) : null,
    },
    {
      title: '平均赔率',
      width: 200,
      dataIndex: 'averageOdds',
      render: val =>
        val ? (
          <Popover content={'示例:格式：2.25;3.35;2.85, (主胜；平局 ；客胜)'} title="示例">
            <a>{val}</a>
          </Popover>
        ) : null,
    },
  ];

  componentDidMount() {
    const id = this.props.location.query.id || null;
    this.setState({ competitionById: id }, () => {
      this.getReloadList();
    });
    this.getStatusList();
  }

  getReloadList = params => {
    const {
      dispatch,
      PredictionRecordListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {}, competitionById } = this.state;
    // console.log('pagination``````````````````',pagination)
    let params12 = {
      pageIndex: current,
      pageSize: 10,
      ...formValues,
      ...params,
    };
    if (competitionById) params12.competitionById = Number(competitionById);
    if (params12.params12) {
      params12.params12 = Number(params12.params12);
    }
    dispatch({
      type: 'PredictionRecordListModel/fetch',
      payload: params12,
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
        let PredictionStatus = list.filter(item => item.parentCode === 'PredictionStatus');
        let BindState = list.filter(item => item.parentCode === 'BindState');
        this.setState({ PredictionStatus, BindState });
      },
    });
  };

  updataStatus = record => {
    const { dispatch } = this.props;
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    dispatch({
      type: 'PredictionRecordListModel/add',
      payload: {
        ...record,
        predictionStatus: record.predictionStatus ? 0 : 1,
      },
      callback: () => {
        message.success('更新成功');
        this.getReloadList();
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
      updateModalVisible: !!flag,
    });
  };

  Unbind = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;
    dispatch({
      type: 'PredictionRecordListModel/add',
      payload: {
        ...record,
        competitionById: null,
      },
      callback: () => {
        message.success('取消绑定成功');
        this.getReloadList();
      },
    });
  };

  // 更新预测记录预测记录
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个预测记录');
      return false;
    }
    dispatch({
      type: 'PredictionRecordListModel/update',
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
      type: 'PredictionRecordListModel/enableAccount',
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
        competitionById: null,
      },
      () => this.getReloadList({ pageIndex: 1 }),
    );
  };

  // type ='itemDelete'  否则删除多个
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
          type: 'PredictionRecordListModel/remove',
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
      type: 'PredictionRecordListModel/add',
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
  updataCompId = e => {
    this.setState({ competitionById: e });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { competitionById, PredictionStatus, BindState } = this.state;
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
              {getFieldDecorator('competitionById', { initialValue: competitionById })(
                <InputNumber
                  placeholder="请输入"
                  onChange={this.updataCompId}
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="绑定状态">
              {getFieldDecorator('bindStatus')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {BindState.map((item, index) => (
                    <Option value={Boolean(Number(item.code))} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="预测结果">
              {getFieldDecorator('predictionStatus')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {PredictionStatus.map((item, index) => (
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
            展开 <Icon type="down" />
          </a>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { competitionById, PredictionStatus, BindState } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
              {getFieldDecorator('competitionById', { initialValue: competitionById })(
                <InputNumber
                  placeholder="请输入"
                  onChange={this.updataCompId}
                  style={{ width: '100%' }}
                />,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="绑定状态">
              {getFieldDecorator('bindStatus')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {BindState.map((item, index) => (
                    <Option value={Boolean(Number(item.code))} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="预测结果">
              {getFieldDecorator('predictionStatus')(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {PredictionStatus.map((item, index) => (
                    <Option value={Number(item.code)} key={index}>
                      {item.displayName}
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
            <FormItem label="时间段">
              {getFieldDecorator('createTime')(<CustomRangePicker />)}
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
      PredictionRecordListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; // 分配预测记录列表
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
                buttonKey.BindingMatch,
              ) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.BindingMatch) || 'hdd'}
                  onClick={() => this.handleUpdateModalVisibleRole(true, {})}
                >
                  绑定赛事
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Unbind) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.Unbind) || 'close-square'
                  }
                  onClick={() => this.Unbind({})}
                >
                  取消绑定
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.UpdateForecastResults,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.UpdateForecastResults) ||
                    'radius-upright'
                  }
                  onClick={() => this.updataStatus({})}
                >
                  更新预测结果
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

        {updateModalVisible ? (
          <UpdateForm
            updataCookieStatus={this.state.updateModalVisible}
            handleUpdateCookieModel={this.handleUpdateModalVisibleRole}
            value={this.state.stepFormValues}
            getReloadList={this.getReloadList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
