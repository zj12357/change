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

@connect(({ GetShortDomainListModel, loading }) => ({
  GetShortDomainListModel,
  submitting: loading.effects['GetShortDomainListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //模块配置列表
    isEditName: '新增',
    domainList: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    this.getDomain();
  }
  getDomain = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'DomainListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        this.setState({
          domainList: data.domainParamList,
        });
      },
    });
  };
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
      GetShortDomainListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], domainList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}短域名`}
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

        <FormItem {...formItemLayout} label="域名">
          {form.getFieldDecorator('did', {
            rules: [
              {
                required: false,
                message: '请选择域名！',
              },
            ],
            initialValue: editRoleDate.did,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择域名"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {domainList.map((item, index) => (
                <Option value={Number(item.did)} key={index}>
                  {item.domain}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="已生成次数">
          {form.getFieldDecorator('generateAmt', {
            rules: [
              {
                required: false,
                message: '请输入已生成次数！',
              },
            ],
            initialValue: editRoleDate.generateAmt,
          })(<InputNumber placeholder="请输入已生成次数" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="累计域名数">
          {form.getFieldDecorator('domainAmt', {
            rules: [
              {
                required: false,
                message: '请输入累计域名数！',
              },
            ],
            initialValue: editRoleDate.domainAmt,
          })(<InputNumber placeholder="请输入累计域名数" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="累计访问数">
          {form.getFieldDecorator('accessAmt', {
            rules: [
              {
                required: false,
                message: '请输入累计访问数！',
              },
            ],
            initialValue: editRoleDate.accessAmt,
          })(<InputNumber placeholder="请输入累计访问数" style={{ width: '100%' }} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
