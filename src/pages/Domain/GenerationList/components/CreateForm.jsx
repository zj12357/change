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

@connect(({ GenerationListModel, loading }) => ({
  GenerationListModel,
  submitting: loading.effects['GenerationListModel/add'],
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
      type: 'GetShortDomainListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const sysMenuList = data.shortDomainParamList || [];
        this.setState({ sysMenuList });
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
      GenerationListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}短链接生成`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="短域名">
          {form.getFieldDecorator('sdid', {
            rules: [
              {
                required: true,
                message: '请选择短域名',
              },
            ],
            initialValue: editRoleDate.sdid,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择短域名"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysMenuList.map(item => (
                <Option value={item.sdid} key={item.sdid}>
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
                required: true,
                message: '请输入域名！',
              },
            ],
            initialValue: editRoleDate.domain,
          })(<Input placeholder="请输入域名" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
