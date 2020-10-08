import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';




import { connect } from 'dva';

import { keysID, listId } from './../keys.js';
import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx'

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




@connect(({ GetSensitiveWordsModel, loading }) => ({
  GetSensitiveWordsModel,
  submitting: loading.effects['GetSensitiveWordsModel/add'],
}))


class CreateForm extends Component {
  state = {
    sysMenuList: [], //系统广告图列表
    modeList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }


    // dispatch({
    //   type: 'dictionaryListModel/fetch',
    //   payload: {
    //     pageIndex: 1,
    //     pageSize: 300,
    //   },
    //   callback: (data) => {
    //     const list = data.dictionaryList || [];
    //     let modeList = list.filter(item => item.typeCode === 'RedirectType');
    //     this.setState({ modeList })
    //   }
    // });
  }




  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };
      if (editRoleDate.name) {
        value.oldword = editRoleDate.name;
        value.newword = fieldsValue.words;
      }

      // form.resetFields();
      handleAdd(value);


    });
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, GetSensitiveWordsModel: { data }, submitting } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}敏感字`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="敏感字">
          {form.getFieldDecorator('words', {
            rules: [
              {
                required: true,
                message: '请输入敏感字！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入敏感字" />)}
        </FormItem>

        {/* <FormItem {...formItemLayout} label="规则">
          {form.getFieldDecorator('rules', {
            rules: [
              {
                required: false,
                message: '请输入规则！',
              },
            ],
            initialValue: editRoleDate.rules,
          })(<Input placeholder="请输入规则" />)}
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
        </FormItem> */}

        {/* <FormItem {...formItemLayout} label="创建人">
          {form.getFieldDecorator('sysUserById', {
            rules: [
              {
                required: false,
                message: '请输入创建人！',
              },
            ],
            initialValue: editRoleDate.sysUserById,
          })(<Input placeholder="请输入创建人" />)}
        </FormItem> */}


        {/* <FormItem {...formItemLayout} label="创建时间">
          {form.getFieldDecorator('createTime', {
            rules: [
              {
                required: false,
                message: '请输入创建时间！',
              },
            ],
            initialValue: editRoleDate.createTime,
          })(<CustomDatePicker/>)}
        </FormItem> */}




        {/* <FormItem {...formItemLayout} label="跳转类型">
          {form.getFieldDecorator('status', {
            rules: [
              {
                required: false,
                message: '请输入跳转类型！',
              },
            ],
            initialValue: editRoleDate.status,
          })(
             <Select
                  style={{ width: '100%' }}
                  placeholder="请选择跳转类型">
                  {modeList.map(item => {
                    return (
                      <Option value={item.did} key={item.did}>{item.value}</Option>
                    )
                  })
                  }
                </Select>,
          )}
        </FormItem> */}


      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
