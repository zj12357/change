import React, { Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { getUserInfo } from '@/utils/utils.js';
import {
  Avatar,
  Icon,
  Menu,
  Spin,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Steps,
  message,
} from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ loading, login }) => ({
  login,
  submitting: loading.effects['login/cipherEdit'],
}))
class AvatarDropdown extends React.Component {
  state = { visible: false };

  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    if (key === 'changePassword') {
      this.showModal();
      return;
    }

    router.push(`/account/${key}`);
  };

  showModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  okHandle = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const userName = getUserInfo().userID;

      dispatch({
        type: 'login/cipherEdit',
        payload: {
          ...fieldsValue,
          userName,
        },
        callback: () => {
          message.success('修改成功');
          this.showModal();
        },
      });
    });
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
      form,
      submitting,
    } = this.props;
    let userData = getUserInfo();
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
        <Menu.Item key="changePassword">
          <Icon type="edit" />
          修改密码
        </Menu.Item>
      </Menu>
    );
    return (
      <Fragment>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
              alt="avatar"
            />

            <span className={styles.name}>{userData.userID}</span>
          </span>
        </HeaderDropdown>

        <Modal
          title="修改密码 "
          visible={this.state.visible}
          onOk={this.okHandle}
          onCancel={this.showModal}
          bodyStyle={{
            padding: '32px 40px 48px',
          }}
          destroyOnClose
          confirmLoading={submitting}
          maskClosable={false}
        >
          <FormItem {...formItemLayout} label="旧密码">
            {form.getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码！',
                },
              ],
            })(<Input.Password placeholder="请输入旧密码" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="新密码">
            {form.getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码！',
                },
              ],
            })(<Input.Password placeholder="请输入新密码" />)}
          </FormItem>
        </Modal>
      </Fragment>
    );
  }
}

export default Form.create()(AvatarDropdown);

// connect(({ user }) => ({
//   currentUser: user.currentUser,
// }))(AvatarDropdown);
