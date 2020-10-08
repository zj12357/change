import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import moment from 'moment';

const columns = [
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '取款金额',
    dataIndex: 'withdrawalAmt',
  },
  {
    title: '取款时间',
    dataIndex: 'withdrawalTime',
    render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
];

@connect(({ lineUserListModel, loading }) => ({
  lineUserListModel,
  loading: loading.effects['lineUserListModel/GetUserWithdrawalList'],
}))
class WithdrawRecord extends Component {
  state = {
    GetUserWithdrawalList: [],
    pagination: {},
  };
  componentDidMount() {
    this.getRecordList();
  }
  getRecordList = (params = {}) => {
    const { dispatch, userId, beginTime, endTime } = this.props;
    dispatch({
      type: 'lineUserListModel/GetUserWithdrawalList',
      payload: {
        userID: userId,
        beginTime,
        endTime,
        pageIndex: params.current || 1,
        pageSize: 10,
      },
      callback: data => {
        const { list = [], page = {} } = data;
        this.setState({
          GetUserWithdrawalList: list,
          pagination: {
            total: page.pageRecord,
            pageSize: page.pageSize,
            current: page.pageIndex,
            pages: page.pageCount,
          },
        });
      },
    });
  };
  handleTableChange = pagination => {
    this.getRecordList(pagination);
  };
  render() {
    const { GetUserWithdrawalList, pagination } = this.state;
    const { loading } = this.props;
    return (
      <div>
        <Table
          rowKey={record => record.id}
          dataSource={GetUserWithdrawalList}
          columns={columns}
          pagination={pagination}
          onChange={this.handleTableChange}
          loading={loading}
        />
      </div>
    );
  }
}

export default WithdrawRecord;
