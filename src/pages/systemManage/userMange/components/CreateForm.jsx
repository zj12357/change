import { Form, Input, InputNumber, Modal, Radio, Select, TreeSelect } from 'antd';
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

@connect(({ userMangeModel, loading }) => ({
  userMangeModel,
  submitting: loading.effects['userMangeModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //用户列表
    sysUserList: [],
    isEditName: '新增',
    SysAdminUserType: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'departmentModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        let list = data.deptList || [];
        this.setState({ sysMenuList: list });
      },
    });
    this.getStatusList();
  }

  getChildren = data => {
    return data.map(item => {
      return {
        title: item.name,
        key: item.deptID,
        value: item.deptID,
        children:
          item.children == null || item.children.length <= 0 ? [] : this.getChildren(item.children),
      };
    });
  };
  getStatusList = () => {
    const { dispatch } = this.props;
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
        let SysAdminUserType = list.filter(item => item.parentCode === 'SysAdminUserType');
        this.setState({ SysAdminUserType });
      },
    });
  };
  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      handleAdd({ [keysID]: editRoleDate[keysID], ...fieldsValue });
    });
  };
  render() {
    const { modalVisible, form, handleModalVisible, editRoleDate = {}, submitting } = this.props;
    const { isEditName, sysMenuList = [], SysAdminUserType } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}用户`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="用户名称">
          {form.getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入用户名称！',
              },
            ],
            initialValue: editRoleDate.userName,
          })(<Input placeholder="请输入用户名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="用户类型">
          {form.getFieldDecorator('sysUserType', {
            rules: [
              {
                required: true,
                message: '请选择用户类型',
              },
            ],
            initialValue: editRoleDate.sysUserType,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择用户类型"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {SysAdminUserType.map((item, index) => {
                return (
                  <Option value={Number(item.code)} key={index}>
                    {item.displayName}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="真实姓名">
          {form.getFieldDecorator('realName', {
            rules: [
              {
                required: false,
                message: '请输入真实姓名！',
              },
            ],
            initialValue: editRoleDate.realName,
          })(<Input placeholder="请输入真实姓名" />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="密码"
          style={{ display: isEditName === '修改' ? 'none' : 'block' }}
        >
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: isEditName === '修改' ? false : true,
                message: '请输入密码！',
              },
              {
                min: 6,
                message: '密码最少六个字符',
              },
            ],
            initialValue: editRoleDate.password,
          })(<Input.Password placeholder="请输入密码" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="部门">
          {form.getFieldDecorator('deptID', {
            rules: [
              {
                required: false,
                message: '请选择部门',
              },
            ],
            initialValue: editRoleDate.deptID,
          })(
            <TreeSelect
              style={{ width: '100%' }}
              placeholder="请选择部门"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
              treeData={this.getChildren(sysMenuList)}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            ></TreeSelect>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="手机">
          {form.getFieldDecorator('mobile', {
            rules: [
              {
                required: false,
                message: '请输入手机！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ],
            initialValue: editRoleDate.mobile,
          })(<Input placeholder="请输入手机" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="邮箱">
          {form.getFieldDecorator('email', {
            rules: [
              {
                required: false,
                message: '请输入邮箱！',
              },
              {
                pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                message: '邮箱号格式错误！',
              },
            ],
            initialValue: editRoleDate.email,
          })(<Input placeholder="请输入邮箱" />)}
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

        <FormItem {...formItemLayout} label="查询次数">
          {form.getFieldDecorator('queryTimes', {
            rules: [
              {
                required: false,
                message: '请输入查询次数！',
              },
            ],
            initialValue: editRoleDate.queryTimes,
          })(<InputNumber style={{ width: '100%' }} min={1} placeholder="请输入查询次数" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="短信条数">
          {form.getFieldDecorator('smsBalane', {
            rules: [
              {
                required: false,
                message: '请输入短信条数！',
              },
            ],
            initialValue: editRoleDate.smsBalane,
          })(<InputNumber style={{ width: '100%' }} min={1} placeholder="请输入短信条数" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
