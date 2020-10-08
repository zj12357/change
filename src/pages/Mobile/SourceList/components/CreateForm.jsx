import { Form, Input, InputNumber, Modal, Radio, Select, TreeSelect } from 'antd';
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

@connect(({ SourceListModel, loading }) => ({
  SourceListModel,
  submitting: loading.effects['SourceListModel/add'],
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
      type: 'SourceListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const list = data.list || [];
        this.setState({ sysMenuList: list });
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

  getChildren = data => {
    return data.map(item => {
      return {
        title: item.name,
        key: item.id,
        value: item.code,
        children:
          item.children == null || item.children.length <= 0 ? [] : this.getChildren(item.children),
      };
    });
  };
  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      SourceListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}数据来源`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout} label="代码">
          {form.getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入代码！',
              },
            ],
            initialValue: editRoleDate.code,
          })(<Input placeholder="请输入代码" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="父节点">
          {form.getFieldDecorator('parentCode', {
            rules: [
              {
                required: false,
                message: '请选择数据渠道',
              },
            ],
            initialValue: editRoleDate.parentCode,
          })(
            <TreeSelect
              style={{ width: '100%' }}
              placeholder="请选择父节点"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
              treeData={this.getChildren(sysMenuList)}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            ></TreeSelect>,
          )}
        </FormItem>

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
