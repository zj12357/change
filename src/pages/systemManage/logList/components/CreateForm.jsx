import { Form, Input, Modal,Radio ,Select} from 'antd';
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

@connect(({ logListModel, loading }) => ({
  logListModel,
  submitting: loading.effects['logListModel/add'],
}))


class CreateForm extends Component {
  state = {
    roleList: [], //角色列表
    isEditName:'新增',
  };
  componentDidMount() {
    const { dispatch , editRoleDate ={} } = this.props;
    if( editRoleDate && editRoleDate.id){
        this.setState({isEditName:'修改'});
    }
    // dispatch({
    //   type: 'logListModel/getRolesLists',
    // });
  }

  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  render() {
    const { modalVisible, form, handleAdd, handleModalVisible ,editRoleDate = {} ,logListModel : {data } , submitting} = this.props;
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
          {form.getFieldDecorator('roleName', {
            rules: [
              {
                required: true,
                message: '请输入角色名称！',
              },
            ],
            initialValue: editRoleDate.roleName,
          })(<Input placeholder="请输入角色名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="角色描述">
          {form.getFieldDecorator('roleDesc', {
            rules: [
              {
                required: true,
                message: '请输入角色描述！',
              },
            ],
            initialValue: editRoleDate.roleDesc,
          })(<Input placeholder="请输入角色描述" />)}
        </FormItem>




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
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
