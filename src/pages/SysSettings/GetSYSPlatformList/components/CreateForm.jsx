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

@connect(({ GetSYSPlatformListModel, loading }) => ({
  GetSYSPlatformListModel,
  submitting: loading.effects['GetSYSPlatformListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //系统广告图列表
    DictionaryState: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }

    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showType: 3,
        showDisabled: true,
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let DictionaryState = list.filter(item => item.parentCode === 'DictionaryState');
        this.setState({ DictionaryState });
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
      GetSYSPlatformListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], DictionaryState = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}系统平台`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout} label="标题">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入标题！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入标题" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="是否禁用">
          {form.getFieldDecorator('status', {
            rules: [
              {
                required: false,
                message: '请选择是否禁用',
              },
            ],
            initialValue: editRoleDate.status,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择是否禁用"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {DictionaryState.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.displayName}
                  </Option>
                );
              })}
            </Select>,
          )}
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
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
