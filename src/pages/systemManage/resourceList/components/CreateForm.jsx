import { Form, Input,InputNumber , Modal,Radio ,Select} from 'antd';
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

@connect(({ resourceListModel, loading }) => ({
  resourceListModel,
  submitting: loading.effects['resourceListModel/add'],
}))


class CreateForm extends Component {
  state = {
    sysMenuList: [], //权限列表
    sysPermissionList:[],
    isEditName:'新增',
  };
  componentDidMount() {
    const { dispatch , editRoleDate ={} } = this.props;
    if( editRoleDate && editRoleDate[keysID]){
        this.setState({isEditName:'修改'});
    }
    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex:1,
        pageSize:300,
      },
      callback:(data)=>{
        let list = data.dictionaryList || [];
        list = list.filter(item =>item.typeCode === 'PermissionType')
        this.setState({sysMenuList:list})
      }
    });
    // dispatch({
    //   type: 'resourceListModel/fetch',
    //   payload: {
    //     pageIndex:1,
    //     pageSize:300,
    //   },
    //   callback:(data)=>{
    //     let list = data.sysPermissionList || [];
    //     this.setState({sysPermissionList:list})
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
    const { modalVisible, form, handleAdd, handleModalVisible ,editRoleDate = {} ,resourceListModel : {data } , submitting} = this.props;
    const { isEditName, sysMenuList = [],sysPermissionList = [] } = this.state;
    // console.log(sysMenuList,sysPermissionList)
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}权限`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="权限名称">
          {form.getFieldDecorator('pName', {
            rules: [
              {
                required: true,
                message: '请输入权限名称！',
              },
            ],
            initialValue: editRoleDate.pName,
          })(<Input placeholder="请输入权限名称" />)}
        </FormItem>

         {/* <FormItem {...formItemLayout} label="父级权限">
          {form.getFieldDecorator('parentID', {
            rules: [
              {
                required: false,
                message: '请输入父级权限！',
              },
            ],
            initialValue: editRoleDate.parentID,
          })(
              <Select
                style={{ width:'100%' }}
                placeholder="请选择父级权限">
                  {sysPermissionList.map(item=>{
                    return (
                        <Option value={item.pid} key={item.pid}>{item.pName}</Option>
                    )
                  })
                  }
            </Select>,
          )}
        </FormItem> */}

        <FormItem {...formItemLayout} label="权限备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入权限备注！',
              },
              {
                max:20,
                message: '最大不超过20个字符！',
              },
            ],
            initialValue: editRoleDate.remark,
          })(<Input placeholder="请输入权限备注" />)}
        </FormItem>



          <FormItem {...formItemLayout} label="权限类型">
          {form.getFieldDecorator('pTypeID', {
            rules: [
              {
                required: true,
                message: '请输入权限类型！',
              },
            ],
            initialValue: editRoleDate.pTypeID,
          })(
              <Select
                style={{ width:'100%' }}
                placeholder="请选择权限类型">
                      {/* 1菜单，2接口，3元素 */}

                     {/* <Option value={1} >菜单</Option>
                     <Option value={2} >接口</Option>
                     <Option value={3} >元素</Option> */}

                      {sysMenuList.map(item=>{
                        return (
                            <Option value={item.did} key={item.did}>{item.value}</Option>
                        )
                      })
                      }

            </Select>,
          )}
        </FormItem>

         <FormItem {...formItemLayout} label="权限控制节点">
          {form.getFieldDecorator('node', {
            rules: [
              {
                required: true,
                message: '请输入权限控制节点！',
              },
            ],
            initialValue: editRoleDate.node,
          })(<Input placeholder="请输入权限控制节点" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="权限排序">
          {form.getFieldDecorator('order', {
            rules: [
              {
                required: false,
                message: '请输入权限排序！',
              },
            ],
            initialValue: editRoleDate.order,
          })(<InputNumber  min={1}  placeholder="请输入权限排序"  style={{width:"100%"}}/>)}
        </FormItem>








      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
