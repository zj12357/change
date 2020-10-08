import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component } from 'react';

import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

const FormItem = Form.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ UserInfoListModel, loading }) => ({
  UserInfoListModel,
  submitting: loading.effects['UserInfoListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //模块配置列表
    modeList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };

      // form.resetFields();
      handleAdd(value);
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      UserInfoListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`修改用户信息`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="用户名">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入用户名！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入用户名" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="手机">
          {form.getFieldDecorator('mobile', {
            rules: [
              {
                required: false,
                message: '请输入手机！',
              },
              // {
              //     pattern: /^1\d{10}$/,
              //     message: '手机号格式错误！',
              // },
            ],
            initialValue: editRoleDate.mobile,
          })(<Input placeholder="请输入手机" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="别名">
          {form.getFieldDecorator('alias', {
            rules: [
              {
                required: false,
                message: '请输入别名！',
              },
            ],
            initialValue: editRoleDate.alias,
          })(<Input placeholder="请输入别名" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="性别">
          {form.getFieldDecorator('gender', {
            rules: [
              {
                required: false,
                message: '请输入性别！',
              },
            ],
            initialValue: editRoleDate.gender,
          })(
            <Radio.Group>
              <Radio value={true}>男</Radio>
              <Radio value={false}>女</Radio>
            </Radio.Group>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="生日">
          {form.getFieldDecorator('birthday', {
            rules: [
              {
                required: false,
                message: '请输入生日！',
              },
            ],
            initialValue: editRoleDate.birthday,
          })(<CustomDatePicker />)}
        </FormItem>

        <FormItem {...formItemLayout} label="备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入备注！',
              },
            ],
            initialValue: editRoleDate.remark,
          })(<Input placeholder="请输入备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
