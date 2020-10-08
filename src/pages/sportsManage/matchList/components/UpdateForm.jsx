import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Steps,
  List,
  Table,
  Col,
  Row,
  Popover,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './../style.less';
import { connect } from 'dva';
import moment from 'moment';
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const columns = [
  {
    title: '预测球队名称',
    dataIndex: 'teamName',
  },
  {
    title: '赛事名称',
    dataIndex: 'competitionByName',
  },

  {
    title: '情报内容',
    dataIndex: 'content',
    render: val => val ? (
      <Popover content={<p style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{val}</p>} title='情报内容'>
        <a>情报内容</a>
      </Popover>
    ) : null
  },
  {
    title: '情报分类',
    dataIndex: 'type',
  },
  {
    title: '情报来源',
    dataIndex: 'source',
  },
  {
    title: '创建时间',
    width: 220,
    dataIndex: 'createTime',
    render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
];

function initTotalList(columns) {
  if (!columns) {
    return [];
  }

  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

@connect(({ loading, matchListModel }) => ({
  matchListModel,
  loading: loading.effects['matchListModel/getCustList'],
  submitting: loading.effects['matchListModel/add'],
}))
class UpdateForm extends Component {
  constructor(props) {
    super(props);
    const needTotalList = initTotalList(columns);
    this.state = {
      sysUserList: [],
      proxyUserList: [],
      selectedRowKeys: [],
      needTotalList,
      formValues: {},
      pagination: {},
      list: [],
    };
  }

  componentDidMount() {
    this.getCustList();
  }

  getCustList = (params = {}) => {
    const { dispatch, value } = this.props;
    const { pagination = {} } = this.state;
    const { current = 1 } = pagination;
    dispatch({
      type: 'matchListModel/getCustList',
      payload: {
        pageIndex: current,
        pageSize: 5,
        ...params,
        competitionById:Number(value.id),
      },
      callback: data => {
        const { list = [], pagination = {} } = data || {};
        this.setState({ list, pagination });
      },
    });
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const currySelectedRowKeys = selectedRowKeys;
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;

    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({
      selectedRowKeys: currySelectedRowKeys,
      needTotalList,
    });
  };


  clearSelectedRowKeys = () => {
    const { editUserModel } = this.props;
    this.setState({ selectedRowKeys: [] });
    editUserModel();
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
      this.getCustList({ ...values, pageIndex: 1 });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getCustList({ pageIndex: 1 });
  };

  renderAdvancedForm() {
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
          {/* <Col md={8} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('type', {
                initialValue: 'all',
              })(
                <Select style={{ width: '100%' }} placeholder="选择查询类型">
                  <Option value="all">所有</Option>
                  <Option value="member">会员</Option>
                  <Option value="user">普通用户</Option>
                </Select>,
              )}
            </FormItem>
          </Col> */}

          <Col md={8} sm={24}>
            <FormItem label="赛事名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="球队名称">
              {getFieldDecorator('teamName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit" icon="search">
              查询
            </Button>

            <Button
              style={{
                marginLeft: 8,
              }}
              icon="sync"
              onClick={this.handleFormReset}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  handleTableChange = e => {
    const { formValues = {} } = this.state;
    const params = {
      pageIndex: e.current, //当前页
      pageSize: e.pageSize, //每页显示条数
      ...formValues,
    };
    this.getCustList(params);
  };

  okSuccess = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch, handleUpdateCookieModel, getReloadList,value={} } = this.props;
    handleUpdateCookieModel(false);
    // if (Array.isArray(selectedRowKeys) && selectedRowKeys.length === 1) {
    //   dispatch({
    //     type: 'matchListModel/add',
    //     payload: {
    //       ...value,
    //       competitionById:selectedRowKeys[0],
    //     },
    //     callback: () => {
    //       message.success('绑定成功');
    //       handleUpdateCookieModel(false);
    //       getReloadList();
    //     },
    //   });
    // } else {
    //   message.error('只能绑定一个赛事！');
    //   return false;
    // }
  }
  render() {
    const { updataCookieStatus, handleUpdateCookieModel, value, submitting, form } = this.props;
    const { proxyUserList = [], sysUserList = [] } = this.state;
    const { selectedRowKeys, pagination = false, list = [] } = this.state;
    const { rowKey, onChange, ...rest } = this.props;
    const { loading } = this.props;
    const paginationProps = pagination
      ? {
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      }
      : false;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <Modal
        bodyStyle={{
          padding: '20px',
        }}
        destroyOnClose
        title={'查看赔率'}
        visible={updataCookieStatus}
        onCancel={() => handleUpdateCookieModel(false)}
        afterClose={() => handleUpdateCookieModel(false)}
        onOk={this.okSuccess}
        confirmLoading={submitting}
        maskClosable={false}
        width={1200}
      >
        {/* <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </div> */}

       
        <Table
          rowKey={record => record.id}
          // rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          loading={loading}
          scroll={{ y: 2000 }}
          columns={columns}
          {...rest}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
