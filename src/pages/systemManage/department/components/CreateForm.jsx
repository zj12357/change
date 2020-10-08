import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';

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

@connect(({ departmentModel, loading }) => ({
  departmentModel,
  submitting: loading.effects['departmentModel/add'],
}))
class CreateForm extends Component {
  state = {
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
      handleAdd({ ...editRoleDate, ...fieldsValue });
    });
  };
  render() {
    const { modalVisible, form, handleModalVisible, editRoleDate = {}, submitting } = this.props;
    const { isEditName } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}部门`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="部门代码">
          {form.getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入部门代码！',
              },
            ],
            initialValue: editRoleDate.code,
          })(<Input placeholder="请输入部门代码" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="部门名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入部门名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入部门名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="部门排序">
          {form.getFieldDecorator('order', {
            rules: [
              {
                required: false,
                message: '请输入部门排序！',
              },
            ],
            initialValue: editRoleDate.order,
          })(<InputNumber min={1} placeholder="请输入部门排序" style={{ width: '100%' }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="部门备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入部门备注！',
              },
            ],
            initialValue: editRoleDate.remark,
          })(<Input placeholder="请输入部门备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
