import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
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

@connect(({ GetSYSBlackRecordListModel, loading }) => ({
  GetSYSBlackRecordListModel,
  submitting: loading.effects['GetSYSBlackRecordListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //屏蔽记录列表
    modeList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }

    dispatch({
      type: 'GetSYSBlackWordListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const list = data.sysBlackWordList || [];
        this.setState({ modeList: list });
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
      GetSYSBlackRecordListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}屏蔽记录`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="发送内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入发送内容！',
              },
            ],
            initialValue: editRoleDate.content,
          })(<Input placeholder="请输入发送内容" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="触发内容">
          {form.getFieldDecorator('blackWord', {
            rules: [
              {
                required: false,
                message: '请输入触发内容！',
              },
            ],
            initialValue: editRoleDate.blackWord,
          })(<Input placeholder="请输入触发内容" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="触发内容编号">
          {form.getFieldDecorator('blackWordById', {
            rules: [
              {
                required: false,
                message: '请输入触发内容编号！',
              },
            ],
            initialValue: editRoleDate.blackWordById,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {modeList.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.content}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="用户编号">
          {form.getFieldDecorator('userById', {
            rules: [
              {
                required: false,
                message: '请输入用户编号！',
              },
            ],
            initialValue: editRoleDate.userById,
          })(<Input placeholder="请输入用户编号" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="访问记录编号">
          {form.getFieldDecorator('domainAccessById', {
            rules: [
              {
                required: false,
                message: '请输入访问记录编号！',
              },
            ],
            initialValue: editRoleDate.domainAccessById,
          })(<Input placeholder="请输入访问记录编号" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="时间">
          {form.getFieldDecorator('createTime', {
            rules: [
              {
                required: false,
                message: '请输入时间！',
              },
            ],
            initialValue: editRoleDate.createTime,
          })(<CustomDatePicker />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
