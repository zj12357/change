import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'antd';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

const FormItem = Form.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ SupplyListModel, loading }) => ({
  SupplyListModel,
  submitting: loading.effects['SupplyListModel/add'],
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

      let value = { ...editRoleDate, ...fieldsValue };

      // form.resetFields();
      handleAdd(value);
    });
  };

  render() {
    const { modalVisible, form, handleModalVisible, editRoleDate = {}, submitting } = this.props;
    const { isEditName } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}供应商`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={950}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="代码">
              {form.getFieldDecorator('code', {
                rules: [
                  {
                    required: false,
                    message: '请输入代码',
                  },
                ],
                initialValue: editRoleDate.province,
              })(<Input placeholder="请输入代码" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="供应商">
              {form.getFieldDecorator('desc', {
                rules: [
                  {
                    required: false,
                    message: '请输入供应商',
                  },
                ],
                initialValue: editRoleDate.desc,
              })(<Input placeholder="请输入供应商" />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
