import React, { Component } from 'react';
import { Card, Row, Col, Modal, Table } from 'antd';
import { toMoney } from '@/utils/utils.js';
import { connect } from 'dva';
import moment from 'moment';

const columns = [
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '游戏名称',
    dataIndex: 'name',
  },
  {
    title: '流水',
    dataIndex: 'bets',
  },
  {
    title: '输赢',
    dataIndex: 'profit',
  },
  {
    title: '时间',
    dataIndex: 'collectDate',
    render: value => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
];

@connect(({ getUserStatisticsList, loading }) => ({
  getUserStatisticsList,
  loading: loading.effects['getUserStatisticsList/GetUserBetsDetailHistorylist'],
}))
class Info extends Component {
  state = {
    GetUserBetsDetailHistorylist: [],
    infoData: {},
    gamevisible: false,
    pagination: {},
    gameName: '',
  };
  componentDidMount() {
    this.getRecordList();
  }
  getRecordList = () => {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'getUserStatisticsList/GetUserDetailCollectionList',
      payload: {
        userID: userId,
      },
      callback: data => {
        this.setState({
          infoData: data,
        });
      },
    });
  };
  getHistorylist = (name, pagination = {}) => {
    const { dispatch, userId } = this.props;
    this.setState({
      gameName: name,
    });
    dispatch({
      type: 'getUserStatisticsList/GetUserBetsDetailHistorylist',
      payload: {
        name: name,
        userID: userId,
        pageIndex: pagination.current || 1,
        pageSize: 10,
      },
      callback: data => {
        const { list = [], page = {} } = data;
        this.setState({
          GetUserBetsDetailHistorylist: list,
          pagination: {
            total: page.pageRecord,
            pageSize: page.pageSize,
            current: page.pageIndex,
            pages: page.pageCount,
          },
        });
      },
    });
    this.handleVisible();
  };
  handleVisible = () => {
    this.setState({
      gamevisible: !this.state.gamevisible,
    });
  };
  handleTableChange = pagination => {
    const { gameName } = this.state;
    this.getHistorylist(gameName, pagination);
  };
  render() {
    const { infoData, gamevisible, GetUserBetsDetailHistorylist, pagination } = this.state;
    const { loading } = this.props;
    return (
      <div>
        <Card>
          <Row type="flex" justify="space-between">
            <Col span={8}>用户名：{infoData.userName || ''}</Col>
            <Col span={8}>所属平台：{'亚博体育'}</Col>
            <Col span={8}>活跃状态：{infoData.act || ''}</Col>
          </Row>
          <Row type="flex" justify="space-between" style={{ margin: '14px 0' }}>
            <Col span={8}>
              注册时间：
              {infoData.registerTime
                ? moment(infoData.registerTime).format('YYYY-MM-DD HH:mm:ss')
                : ''}
            </Col>
            <Col span={8}>存款：{infoData.depositAmt ? toMoney(infoData.depositAmt) : 0}</Col>
            <Col span={8}>提款：{infoData.withdrawalAmt ? toMoney(infoData.withdrawalAmt) : 0}</Col>
          </Row>
          <Row type="flex" justify="space-between">
            <Col span={8}>红利：{infoData.promo ? toMoney(infoData.promo) : 0}</Col>
            <Col span={8}>总流水：{infoData.bets ? toMoney(infoData.bets) : 0}</Col>
            <Col span={8}>总输赢：{infoData.profitAmt ? toMoney(infoData.profitAmt) : 0}</Col>
          </Row>
        </Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '20px 0' }}>
          {infoData.gameInfoTotalList &&
            !!infoData.gameInfoTotalList.length &&
            infoData.gameInfoTotalList.map((item, index) => (
              <div style={{ display: 'flex', justifyContent: 'center', width: '50%' }} key={index}>
                <p style={{ width: '50%' }}>
                  {`${item.name}流水：`}{' '}
                  <a
                    onClick={() => this.getHistorylist(item.name)}
                    style={item.bets == 0 ? { color: '#ccc', pointerEvents: 'none' } : {}}
                  >
                    {item.bets}
                  </a>
                </p>
                <p style={{ width: '50%' }}>
                  {`${item.name}输赢：`}{' '}
                  <a
                    onClick={() => this.getHistorylist(item.name)}
                    style={item.profit == 0 ? { color: '#ccc', pointerEvents: 'none' } : {}}
                  >
                    {item.profit}
                  </a>
                </p>
              </div>
            ))}
        </div>
        <Modal
          visible={gamevisible}
          onCancel={this.handleVisible}
          footer={null}
          width={1000}
          title={'历史投注记录'}
        >
          <Table
            rowKey={record => record.id}
            dataSource={GetUserBetsDetailHistorylist}
            columns={columns}
            pagination={pagination}
            onChange={this.handleTableChange}
            loading={loading}
          />
          ;
        </Modal>
      </div>
    );
  }
}

export default Info;
