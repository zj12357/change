import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Popover,
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
import { filtEleBtn, filterImages } from '@/utils/utils.js';
import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';
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
@connect(({ CustomerListModel, loading, login }) => ({
  CustomerListModel,
  login,
  loading: loading.models.CustomerListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    lpid: '',
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '落地页名称',
      dataIndex: 'lpName',
    },
    {
      title: '内容',
      dataIndex: 'content',
      render: val =>
        val ? (
          <Popover
            content={
              <p
                style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}
                dangerouslySetInnerHTML={{ __html: val }}
              ></p>
            }
            title="内容"
          >
            <a>详情</a>
          </Popover>
        ) : null,
    },
    {
      title: '是否禁用',
      dataIndex: 'visible',
      render: val => (val ? '开启' : '禁用'),
    },
  ];

  componentDidMount() {
    const lpid = this.props.location.query.lpid || '';
    this.setState({ lpid }, () => {
      this.getReloadList();
    });
  }

  getReloadList = params => {
    const {
      dispatch,
      CustomerListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {}, lpid } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'CustomerListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
        lpid: Number(lpid),
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
    // if (!!flag) {
    //   dispatch({
    //     type: 'AdvertisingListModel/getResourceByAdminIdServe',
    //     payload: record.id,
    //   }).then(() => {
    //     this.setState({ updateModalVisible: !!flag })
    //   });
    // } else {
    //   this.setState({ updateModalVisible: !!flag })
    // }
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
      type: 'CustomerListModel/update',
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
      type: 'CustomerListModel/enableAccount',
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
          type: 'CustomerListModel/remove',
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
    const { editRoleDate = {}, parentID, lpid } = this.state;

    if (parentID) fields.parent = parentID;
    // console.log('parentID',parentID,fields)
    dispatch({
      type: 'CustomerListModel/add',
      payload: {
        ...fields,
        lpid: Number(lpid),
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
            <FormItem label="是否禁用">
              {getFieldDecorator('visible')(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  <Option value={true}>开启</Option>
                  <Option value={false}>禁用</Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(<Input placeholder="标题" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      CustomerListModel: { data },
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
        <Button onClick={() => router.go(-1)}>返回上页</Button>
        <span
          style={{
            display: 'inline-block',
            marginLeft: '20px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          {pathname.indexOf('CustomerList') > -1 ? '新增客服链接' : ''}
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

              <Button
                type="primary"
                icon="plus"
                onClick={() => this.handleModalVisible(true, 'add')}
              >
                新建
              </Button>

              <Button type="primary" icon="edit" onClick={() => this.handleUpdateModalVisible()}>
                编辑
              </Button>

              <Button
                type="primary"
                icon="delete"
                onClick={() => this.handleMenuClick('itemDelete')}
              >
                删除
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
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
