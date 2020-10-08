import React, { Component } from 'react';
import { Modal } from 'antd';
import Info from './UserTable/info';
import DepositRecord from './UserTable/depositRecord';
import WithdrawRecord from './UserTable/withdrawRecord';

class UserInfo extends Component {
  render() {
    const {
      userModalInfo: { userModalTitle, userId, useTypeKey, beginTime, endTime },
      userVisible,
      handleCloseUserVisible,
    } = this.props;
    return (
      <Modal
        visible={userVisible}
        onCancel={handleCloseUserVisible}
        footer={null}
        width={1000}
        title={userModalTitle}
        maskClosable={false}
        destroyOnClose
      >
        {useTypeKey === 1 ? <Info userId={userId} beginTime={beginTime} endTime={endTime} /> : null}
        {useTypeKey === 2 ? (
          <DepositRecord userId={userId} beginTime={beginTime} endTime={endTime} />
        ) : null}
        {useTypeKey === 3 ? (
          <WithdrawRecord userId={userId} beginTime={beginTime} endTime={endTime} />
        ) : null}
      </Modal>
    );
  }
}

export default UserInfo;
