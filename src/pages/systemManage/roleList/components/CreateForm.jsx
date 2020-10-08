import { Form, Input,InputNumber , Modal,Radio ,Select} from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

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

@connect(({ roleListModel, loading }) => ({
  roleListModel,
  submitting: loading.effects['roleListModel/add'],
}))


class CreateForm extends Component {
  state = {
    roleList: [], //角色列表
    isEditName:'新增',
  };
  componentDidMount() {
    const { dispatch , editRoleDate ={} } = this.props;
    if( editRoleDate && editRoleDate.roleID){
        this.setState({isEditName:'修改'});
    }
    // dispatch({
    //   type: 'roleListModel/getRolesLists',
    // });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // form.resetFields();
      handleAdd({ ...editRoleDate, ...fieldsValue});
    });
  };
  render() {
    const { modalVisible, form, handleAdd, handleModalVisible ,editRoleDate = {} ,roleListModel : {data } , submitting} = this.props;
    const { isEditName } = this.state;
    const { roleList = [] } = data || {};
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}角色`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
         maskClosable={false}
      >
        <FormItem {...formItemLayout} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入角色名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入角色名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="角色代码">
          {form.getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入角色代码！',
              },
            ],
            initialValue: editRoleDate.code,
          })(<Input placeholder="请输入角色代码" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="角色备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入角色备注！',
              },
              {
                max:20,
                message: '最大不超过20个字符！',
              },
            ],
            initialValue: editRoleDate.remark,
          })(<Input placeholder="请输入角色备注" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="角色排序">
          {form.getFieldDecorator('order', {
            rules: [
              {
                required: false,
                message: '请输入角色排序！',
              },
            ],
            initialValue: editRoleDate.order,
          })(<InputNumber  min={1}  placeholder="请输入角色排序"  style={{width:"100%"}}/>)}
        </FormItem>



{/*
        <FormItem {...formItemLayout} label="是否启用">
          {form.getFieldDecorator('enable', {
            rules: [
              {
                required: true,
                message: '请选择是否启用！',
              },
            ],
            initialValue: editRoleDate.enable||0,
          })(
            <Radio.Group>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </Radio.Group>,
          )}
        </FormItem> */}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
