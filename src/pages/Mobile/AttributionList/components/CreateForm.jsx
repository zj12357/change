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

@connect(({ AttributionListModel, loading }) => ({
  AttributionListModel,
  submitting: loading.effects['AttributionListModel/add'],
}))
class CreateForm extends Component {
  state = {
    isEditName: '新增',
    mobileSupplyList: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    //供应商列表
    dispatch({
      type: 'AttributionListModel/mobileSupply',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        this.setState({ mobileSupplyList: data.list || [] });
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
    const { modalVisible, form, handleModalVisible, editRoleDate = {}, submitting } = this.props;
    const { isEditName, mobileSupplyList } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}归属地`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={950}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="省份">
              {form.getFieldDecorator('province', {
                rules: [
                  {
                    required: false,
                    message: '请输入省份',
                  },
                ],
                initialValue: editRoleDate.province,
              })(<Input placeholder="请输入省份" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="城市">
              {form.getFieldDecorator('city', {
                rules: [
                  {
                    required: false,
                    message: '请输入城市',
                  },
                ],
                initialValue: editRoleDate.city,
              })(<Input placeholder="请输入城市" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="供应商">
              {form.getFieldDecorator('supplyCode', {
                rules: [
                  {
                    required: false,
                    message: '请输入供应商',
                  },
                ],
                initialValue: editRoleDate.supplyCode,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择供应商"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {mobileSupplyList.map((item, index) => (
                    <Option value={item.code} key={index}>
                      {item.desc}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="归属地号码">
              {form.getFieldDecorator('code', {
                rules: [
                  {
                    required: false,
                    message: '请输入归属地号码',
                  },
                ],
                initialValue: editRoleDate.code,
              })(<Input placeholder="请输入归属地号码" />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
