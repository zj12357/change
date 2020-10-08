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
    title: '存款金额',
    dataIndex: 'depositAmt',
  },
  {
    title: '存款时间',
    dataIndex: 'depositTime',
    render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
];

@connect(({ getUserStatisticsList, loading }) => ({
  getUserStatisticsList,
  loading: loading.effects['getUserStatisticsList/GetUserDespositList'],
}))
class DepositRecord extends Component {
  state = {
    GetUserDespositList: [],
    pagination: {},
  };
  componentDidMount() {
    this.getRecordList();
  }
  getRecordList = (params = {}) => {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'getUserStatisticsList/GetUserDespositList',
      payload: {
        userID: userId,
        pageIndex: params.current || 1,
        pageSize: 10,
      },
      callback: data => {
        const { list = [], page = {} } = data;
        this.setState({
          GetUserDespositList: list,
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
    const { GetUserDespositList, pagination } = this.state;
    const { loading } = this.props;
    return (
      <div>
        <Table
          rowKey={record => record.id}
          dataSource={GetUserDespositList}
          columns={columns}
          pagination={pagination}
          onChange={this.handleTableChange}
          loading={loading}
        />
      </div>
    );
  }
}

export default DepositRecord;
