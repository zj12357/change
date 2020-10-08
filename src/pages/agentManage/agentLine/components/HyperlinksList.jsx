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
} from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './../style.less';
import { connect } from 'dva';
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

/**
  title={item.domainName}
  description={
  <Fragment>
  <p>域名地址：{item.domainAddress}</p>
  <p>状态：{item.stateName}</p>
  <p>名称：{item.plName}</p>
  </Fragment>
 */
const columns = [
  {
    title: '名称',
    dataIndex: 'domainName',
  },
  {
    title: '域名地址',
    dataIndex: 'domainAddress',
    width:280,
  },
  
  {
    title: '状态',
    dataIndex: 'stateName',
  },
  {
    title: '名称',
    dataIndex: 'plName',
  },
  {
    title: 'token',
    dataIndex: 'token',
    width:120,
    render: val => val ? (
      <Popover content={<p style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{val}</p>} title='查看token' trigger="click">
        <Button type="primary">查看token</Button>
      </Popover>
    ) : null
  },
  {
    title: 'cookie',
    width:120,
    dataIndex: 'cookie',
    render: val => val ? (
      <Popover content={<p style={{ width: '400px', wordWrap: 'break-word', wordBreak: 'normal' }}>{val}</p>} title='查看cookie' trigger="click">
        <Button type="primary">查看cookie</Button>
      </Popover>
    ) : null
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

@connect(({ loading }) => ({
  loading: loading.effects['agentLineModel/getCustList'],
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
      type: 'agentLineModel/getCustList',
      payload: {
        pageIndex: current,
        pageSize: 10,
        plid: value.plid,
        ...params,
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

  sendVoucher = () => {
    const { selectedRowKeys } = this.state;
    const { userSelectItem, dispatch } = this.props;
    // if (!selectedRowKeys || (Array.isArray(selectedRowKeys) && selectedRowKeys.length <= 0)) {
    //   message.info('请至少选择一位用户');
    //   return false;
    // }
    // let userId = [];
    // userSelectItem.forEach(item => userId.push(item.id));

    // const _thas = this;

    // Modal.confirm({
    //   title: '发送卡券',
    //   content: '您确定要发送卡券嘛?',
    //   okText: '确定',
    //   cancelText: '取消',
    //   onOk() {
    //     dispatch({
    //       type: 'couponCardModel/sendTicket',
    //       payload: {
    //         ticketId: userId,
    //         userId: selectedRowKeys,
    //         type: 'discount', //优惠卡discount   邀请卡Invite
    //         ticketType: 'discount',
    //         isAll: false,
    //       },
    //       callback: () => {
    //         message.info('发送成功');
    //         _thas.setState({ selectedRowKeys: [] });
    //       },
    //     });
    //   },
    // });

    // console.log(selectedRowKeys, userSelectItem,userId);
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
            <FormItem label="电话">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
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
        title={'代理线登录域名列表信息'}
        visible={updataCookieStatus}
        onCancel={() => handleUpdateCookieModel(false)}
        afterClose={() => handleUpdateCookieModel(false)}
        onOk={() => handleUpdateCookieModel(false)}
        confirmLoading={submitting}
        maskClosable={false}
        width={1200}
      >
        {/* <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
        </div>

        <span style={{ display: 'block', marginBottom: '5px', marginTop: '15px' }}>
          <Button onClick={this.sendVoucher} icon="import" type="primary" loading={submitting}>
            定向发送卡券
          </Button>
        </span> */}
        <Table
          rowKey={record => record.pldid}
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
