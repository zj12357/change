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

@connect(({ DomainListModel, loading }) => ({
  DomainListModel,
  submitting: loading.effects['DomainListModel/add'],
}))
class CreateForm extends Component {
  state = {
    DictionaryState: [], //模块配置列表
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
        showDisabled: true,
        showType: 3,
      },
      callback: data => {
        const list = data.dictionaryList || [];
        const DictionaryState = list.filter(item => item.parentCode === 'DictionaryState');
        this.setState({ DictionaryState });
      },
    });
    dispatch({
      type: 'DomainDnsListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const modeList = data.domainDnsParamList || [];
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
      DomainListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, DictionaryState = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}域名`}
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

        <FormItem {...formItemLayout} label="API配置">
          {form.getFieldDecorator('ddid', {
            rules: [
              {
                required: true,
                message: '请选择API配置',
              },
            ],
            initialValue: editRoleDate.ddid,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择API配置"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {modeList.map(item => (
                <Option value={item.ddid} key={item.ddid}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="域名">
          {form.getFieldDecorator('domain', {
            rules: [
              {
                required: false,
                message: '请输入域名！',
              },
            ],
            initialValue: editRoleDate.domain,
          })(<Input placeholder="请输入域名" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="域名状态">
          {form.getFieldDecorator('stateID', {
            rules: [
              {
                required: false,
                message: '请选择域名状态',
              },
            ],
            initialValue: editRoleDate.stateID,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择域名状态"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {DictionaryState.map((item, index) => (
                <Option value={item.code} key={index}>
                  {item.displayName}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
