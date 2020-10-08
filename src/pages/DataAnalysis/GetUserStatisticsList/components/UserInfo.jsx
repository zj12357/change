import React, { Component } from 'react';
import { Modal } from 'antd';
import Info from './UserTable/info';
import DepositRecord from './UserTable/depositRecord';
import WithdrawRecord from './UserTable/withdrawRecord';

class UserInfo extends Component {
  render() {
    const {
      userModalInfo: { userModalTitle, userId, useTypeKey },
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
        {useTypeKey === 1 ? <Info userId={userId} /> : null}
        {useTypeKey === 2 ? <DepositRecord userId={userId} /> : null}
        {useTypeKey === 3 ? <WithdrawRecord userId={userId} /> : null}
      </Modal>
    );
  }
}

export default UserInfo;
