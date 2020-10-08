import { Form, Input,InputNumber , Modal,Radio ,Select} from 'antd';
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

@connect(({ collectorpDomainModel, loading }) => ({
  collectorpDomainModel,
  submitting: loading.effects['collectorpDomainModel/add'],
}))


class CreateForm extends Component {
  state = {
    sysMenuList: [], //域名列表
    sysUserList:[],
    isEditName:'新增',
  };
  componentDidMount() {
    const { dispatch , editRoleDate ={} } = this.props;
    if( editRoleDate && editRoleDate[keysID]){
        this.setState({isEditName:'修改'});
    }

    //  dispatch({
    //   type: 'collectorpDomainModel/fetch',
    //   payload: {
    //     pageIndex:1,
    //     pageSize:300,
    //   },
    //   callback:(data)=>{
    //     const { sysUserList = [] } = data;
    //     this.setState({sysUserList})
    //   }
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
    const { modalVisible, form, handleAdd, handleModalVisible ,editRoleDate = {} ,collectorpDomainModel : {data } , submitting} = this.props;
    const { isEditName, sysMenuList = [] , sysUserList = [] } = this.state;
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
        <FormItem {...formItemLayout} label="域名名称">
          {form.getFieldDecorator('domainName', {
            rules: [
              {
                required: true,
                message: '请输入域名名称！',
              },
            ],
            initialValue: editRoleDate.domainName	,
          })(<Input placeholder="请输入域名名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="域名地址">
          {form.getFieldDecorator('domainAddress', {
            rules: [
              {
                required: false,
                message: '请输入域名地址！',
              },
              // {
              //    pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
              //    message: '域名地址格式错误！',
              // },
            ],
            initialValue: editRoleDate.domainAddress,
          })(<Input placeholder="请输入域名地址" />)}
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




          {/* <FormItem {...formItemLayout} label="上级">
          {form.getFieldDecorator('parentID', {
            rules: [
              {
                required: false,
                message: '请输入上级！',
              },
            ],
            initialValue: editRoleDate.parentID,
          })(
            <Select
              style={{ width:'100%' }}
              placeholder="请选择上级">
                {sysUserList.map(item=>{
                  return (
                      <Option value={item.userID} key={item.userID}>{item.userName}</Option>
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
