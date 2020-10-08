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

@connect(({ dictionaryListModel, loading }) => ({
  dictionaryListModel,
  submitting: loading.effects['dictionaryListModel/add'],
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
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showType: 2,
        showDisabled: true,
      },
      callback: data => {
        const { dictionaryList = [] } = data;
        this.setState({ sysMenuList: dictionaryList });
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
      dictionaryListModel: { data },
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
        <FormItem {...formItemLayout} label="字典名称">
          {form.getFieldDecorator('displayName', {
            rules: [
              {
                required: true,
                message: '请输入字典名称！',
              },
            ],
            initialValue: editRoleDate.displayName,
          })(<Input placeholder="请输入字典名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="字典代码">
          {form.getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入字典代码！',
              },
            ],
            initialValue: editRoleDate.code,
          })(<Input placeholder="请输入字典代码" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="排序">
          {form.getFieldDecorator('sort', {
            rules: [
              {
                required: false,
                message: '请输入字典排序',
              },
            ],
            initialValue: editRoleDate.sort,
          })(<Input placeholder="请输入字典排序" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="父节点">
          {form.getFieldDecorator('parentCode', {
            rules: [
              {
                required: false,
                message: '请选择父节点',
              },
            ],
            initialValue: editRoleDate.parentCode,
          })(
            <Select style={{ width: '100%' }} placeholder="请选择父节点">
              {sysMenuList.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.displayName}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="图标">
          {form.getFieldDecorator('iconPath', {
            rules: [
              {
                required: false,
                message: '请输入图标！',
              },
            ],
            initialValue: editRoleDate.iconPath,
          })(
            // <div>
            <Input placeholder="请输入图标(例：setting)" />,
            // <a href="https://3x.ant.design/components/icon-cn/" target='_blank'>前往图标库</a>
            // </div>
            // <Input placeholder="请输入图片路径" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="是否禁用">
          {form.getFieldDecorator('disabled', {
            rules: [
              {
                required: false,
                message: '请选择是否禁用！',
              },
            ],
            initialValue: editRoleDate.disabled,
          })(
            <Radio.Group>
              <Radio value={'0'}>启用</Radio>
              <Radio value={'1'}>禁用</Radio>
            </Radio.Group>,
          )}
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
