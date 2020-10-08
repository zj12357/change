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

@connect(({ GetSysTemplateRecordListModel, loading }) => ({
  GetSysTemplateRecordListModel,
  submitting: loading.effects['GetSysTemplateRecordListModel/add'],
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
    dispatch({
      type: 'GetSysTemplateConfigListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { sysTemplateTypeList = [] } = data;
        this.setState({ sysMenuList: sysTemplateTypeList });
      },
    });
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
      GetSysTemplateRecordListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}短信记录`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="模板">
          {form.getFieldDecorator('templateConfigById', {
            rules: [
              {
                required: true,
                message: '请选择模板！',
              },
            ],
            initialValue: editRoleDate.templateConfigById,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择模板"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysMenuList.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="手机号码">
          {form.getFieldDecorator('mobile', {
            rules: [
              {
                required: true,
                message: '请输入手机！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ],
            initialValue: editRoleDate.mobile,
          })(<Input placeholder="请输入手机" />)}
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
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
