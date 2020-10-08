import { Modal, Table } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { keysID } from '../keys';

const columns = [
  {
    title: '操作者',
    dataIndex: 'operationUserName',
  },
  {
    title: '备注',
    dataIndex: 'reamrk',
  },
];

@connect(({ DistributionListModel, loading }) => ({
  DistributionListModel,
  loading: loading.effects['DistributionListModel/applyRecordList'],
}))
class NumberRecordList extends Component {
  state = {
    recordList: [],
  };
  componentWillMount() {
    const { dispatch, NumberRecordDate } = this.props;
    dispatch({
      type: 'DistributionListModel/applyRecordList',
      payload: {
        assignID: NumberRecordDate.id,
      },
      callback: data => {
        let { list } = data;
        this.setState({
          recordList: list,
        });
      },
    });
  }
  okHandle = () => {
    this.props.handleUpdateModalVisibleRecord();
  };
  render() {
    const { NumberRecordSVisible, handleUpdateModalVisibleRecord } = this.props;
    const { recordList } = this.state;
    return (
      <Modal
        width={950}
        destroyOnClose
        title="流程记录"
        visible={NumberRecordSVisible}
        onCancel={handleUpdateModalVisibleRecord}
        onOk={this.okHandle}
        maskClosable={false}
      >
        <Table
          rowKey={record => record[keysID]}
          size={'middle'}
          dataSource={recordList}
          columns={columns}
          pagination={false}
        />
      </Modal>
    );
  }
}

export default NumberRecordList;
