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

@connect(({ GetSYSBlackWordListModel, loading }) => ({
  GetSYSBlackWordListModel,
  submitting: loading.effects['GetSYSBlackWordListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //系统广告图列表
    modeList: [],
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
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let modeList = list.filter(item => item.typeCode === 'RedirectType');
        this.setState({ modeList });
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
      GetSYSBlackWordListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}屏蔽词`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入内容！',
              },
            ],
            initialValue: editRoleDate.content,
          })(<Input placeholder="请输入内容" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="规则">
          {form.getFieldDecorator('rules', {
            rules: [
              {
                required: false,
                message: '请输入规则！',
              },
            ],
            initialValue: editRoleDate.rules,
          })(<Input placeholder="请输入规则" />)}
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
