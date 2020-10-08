import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
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

@connect(({ GetSysTemplateConfigListModel, loading }) => ({
  GetSysTemplateConfigListModel,
  submitting: loading.effects['GetSysTemplateConfigListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //短信模板列表
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
      GetSysTemplateConfigListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}短信模板`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: false,
                message: '请输入内容！',
              },
            ],
            initialValue: editRoleDate.content,
          })(<Input placeholder="请输入内容" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="使用次数">
          {form.getFieldDecorator('useCount', {
            rules: [
              {
                required: false,
                message: '请输入使用次数！',
              },
            ],
            initialValue: editRoleDate.useCount,
          })(<InputNumber placeholder="请输入使用次数" style={{ width: '100%' }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="排序">
          {form.getFieldDecorator('sort', {
            rules: [
              {
                required: false,
                message: '请输入排序！',
              },
            ],
            initialValue: editRoleDate.sort,
          })(<InputNumber placeholder="请输入排序" style={{ width: '100%' }} />)}
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
