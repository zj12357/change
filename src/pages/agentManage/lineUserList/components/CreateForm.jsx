import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';
import { flatArrs } from '@/utils/utils.js';

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

@connect(({ lineUserListModel, loading }) => ({
  lineUserListModel,
  submitting: loading.effects['lineUserListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //字典列表
    sysPermissionList: [], //权限列表
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'lineUserListModel/DictionaryTypeLists',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { dictionaryTypeList = [] } = data;
        this.setState({ sysMenuList: dictionaryTypeList.filter(item => item.code === 'Usage') });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // form.resetFields();
      handleAdd({ ...editRoleDate, ...fieldsValue });
    });
  };
  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      lineUserListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], sysPermissionList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}字典`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={600}
      >
        <FormItem {...formItemLayout} label="请选择类型">
          {form.getFieldDecorator('dtid', {
            rules: [
              {
                required: true,
                message: '请选择类型',
              },
            ],
            initialValue: editRoleDate.dtid,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择类型"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysMenuList.map(item => {
                return (
                  <Option value={item.dtid} key={item.dtid}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="字典名称">
          {form.getFieldDecorator('value', {
            rules: [
              {
                required: true,
                message: '请输入字典名称！',
              },
            ],
            initialValue: editRoleDate.value,
          })(<Input placeholder="请输入字典名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="字典编号">
          {form.getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入字典编号！',
              },
            ],
            initialValue: editRoleDate.code,
          })(<Input placeholder="请输入字典编号" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="字典备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入字典备注！',
              },
              {
                max: 50,
                message: '最大不超过50个字符！',
              },
            ],
            initialValue: editRoleDate.remark,
          })(<Input placeholder="请输入字典备注" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
