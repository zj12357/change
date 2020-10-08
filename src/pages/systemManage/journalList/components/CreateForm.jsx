import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';
import { flatArrs } from '@/utils/utils.js'

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

@connect(({ journalListModel, loading }) => ({
  journalListModel,
  submitting: loading.effects['journalListModel/add'],
}))


class CreateForm extends Component {
  state = {
    sysMenuList: [], //列表
    sysPermissionList: [],//权限列表
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'journalListModel/DictionaryTypeLists',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: (data) => {
        const { dictionaryTypeList = [] } = data;
        this.setState({ sysMenuList: dictionaryTypeList.filter(item=>item.code === 'PromotionType') })
      }
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
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, journalListModel: { data }, submitting } = this.props;
    const { isEditName, sysMenuList = [], sysPermissionList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}活动分类`}
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
              placeholder="请选择类型">
              {sysMenuList.map(item => {
                return (
                  <Option value={item.dtid} key={item.dtid}>{item.name}</Option>
                )
              })
              }
            </Select>,
          )}
        </FormItem>


        <FormItem {...formItemLayout} label="活动分类名称">
          {form.getFieldDecorator('value', {
            rules: [
              {
                required: true,
                message: '请输入活动分类名称！',
              },
            ],
            initialValue: editRoleDate.value,
          })(<Input placeholder="请输入活动分类名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="编号">
          {form.getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入编号！',
              },
            ],
            initialValue: editRoleDate.code,
          })(<Input placeholder="请输入编号" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入备注！',
              },
              {
                max: 50,
                message: '最大不超过50个字符！',
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
