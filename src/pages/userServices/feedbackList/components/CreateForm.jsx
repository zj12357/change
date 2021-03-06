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

@connect(({ feedbackListModel, loading }) => ({
  feedbackListModel,
  submitting: loading.effects['feedbackListModel/add'],
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

      let value = {
        ...fieldsValue,
        id: editRoleDate.id,
      };

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
      feedbackListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`回复反馈`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="处理结果">
          {form.getFieldDecorator('processContent', {
            rules: [
              {
                required: true,
                message: '请输入处理结果！',
              },
            ],
            // initialValue: editRoleDate.processContent,
          })(<Input placeholder="请输入处理结果" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="处理时间">
          {form.getFieldDecorator('processdTime', {
            rules: [
              {
                required: true,
                message: '请输入处理时间！',
              },
            ],
            initialValue: new Date(),
          })(<CustomDatePicker />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
