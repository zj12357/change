import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Descriptions,
  Menu,
  Row,
  Select,
  message,
  Modal,
  Popover,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { filtEleBtn, filterImages } from '@/utils/utils.js';
import CustomRangePicker from '@/components/Picker/CustomRangePicker.jsx';
import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
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

/* eslint react/no-multi-comp:0 */
@connect(({ landingRelationActivityModel, loading, login }) => ({
  landingRelationActivityModel,
  login,
  loading: loading.models.landingRelationActivityModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    ldid: 0,
    landingDomainList: [],
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '图片',
      dataIndex: 'image',
      render: text =>
        text ? <img src={filterImages(text)} alt="" style={{ width: '60px' }} /> : '',
    },

    {
      title: '开始日期',
      dataIndex: 'startdate',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '结束日期',
      dataIndex: 'enddate',
      render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
    },

    {
      title: '域名',
      dataIndex: 'domainList',
      render: value =>
        value ? (
          <Popover
            content={
              <Descriptions style={{ width: '500px' }} column={1}>
                {value.map((item, index) => (
                  <Descriptions.Item keys={index} label={item.domainName}>
                    {item.domainAddress}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            }
            title="域名"
          >
            <Button type="primary">查看域名</Button>
          </Popover>
        ) : (
          ''
        ),
    },
    {
      title: '是否带表单',
      dataIndex: 'isForm',
      render: val => (val ? '是' : '否'),
    },
  ];

  componentDidMount() {
    const ldid = this.props.location.query.ldid || 0;
    this.setState({ ldid: Number(ldid) }, () => {
      this.getReloadList();
    });
    this.getPromotionList();
  }
  getPromotionList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LandingDomainListModel/fetch',
      payload: {
        lpid: Number(this.props.location.query.ldid) || '',
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { landingDomainList = [] } = data;
        this.setState({ landingDomainList: landingDomainList });
      },
    });
  };

  getReloadList = params => {
    const {
      dispatch,
      landingRelationActivityModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {}, ldid } = this.state;

    dispatch({
      type: 'landingRelationActivityModel/fetch',
      payload: {
        ldid: null,
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
        lpid: Number(ldid),
      },
      callback: data => {
        // 如删除最后一条数据  最后一页没有数据自动往前减一
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

  handleUpdateModalVisibleRole = (flag, record) => {
    const { dispatch } = this.props;

    this.setState({
      stepFormValues: record || {},
    });
    if (flag) {
      dispatch({
        type: 'landingRelationActivityModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(() => {
        this.setState({ updateModalVisible: !!flag });
      });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  // 更新系统广告图系统广告图
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个系统广告图');
      return false;
    }
    dispatch({
      type: 'landingRelationActivityModel/update',
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
      type: 'landingRelationActivityModel/enableAccount',
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
          type: 'landingRelationActivityModel/remove',
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
      console.log(fieldsValue);
      if (err) return;
      let values = {
        ...fieldsValue,
      };
      if (values.createTime && values.createTime.startTime) {
        values.startdate = values.createTime.startTime;
        values.enddate = values.createTime.endTime;
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
      type: 'landingRelationActivityModel/add',
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

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { landingDomainList } = this.state;
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
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="时间段">
              {getFieldDecorator('createTime')(<CustomRangePicker />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="域名">
              {getFieldDecorator('ldid')(
                <Select style={{ width: '100%' }} placeholder="请选择域名">
                  {landingDomainList.map((item, index) => {
                    return (
                      <Option value={item.ldid} key={index}>
                        {item.domainAddress}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      landingRelationActivityModel: { data },
      loading,
      location: { pathname },
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
    } = this.state;
    const { allResourcesList, yelResourcesList } = data; // 分配系统广告图列表
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
        <Button onClick={() => router.go(-1)}>返回上页</Button>
        <span
          style={{
            display: 'inline-block',
            marginLeft: '20px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          {pathname.indexOf('landingRelationActivity') > -1 ? '活动关联列表' : ''}
        </span>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" icon="search" onClick={this.handleSearch}>
                查询
              </Button>
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
