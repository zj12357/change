import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';

import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx'
import UploadImg from '@/components/Upload/UploadImg.jsx';
import DynamicName from '@/components/DynamicFieldSet/DynamicName.jsx'

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

import moment from 'moment'

const FormItem = Form.Item;

const { Option } = Select;

//添加聊天室 ( AddCharRoom )  添加用户(AddMembers)  添加管理员用户 (RegisterAdminUser)
const typeName = {
  AddCharRoom: '创建聊天室',
  AddMembers: '添加用户',
  RegisterAdminUser: '添加管理员用户'
}



const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};




@connect(({ charRoomListModel, loading }) => ({
  charRoomListModel,
  submitting: loading.effects['charRoomListModel/add'],
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
    // dispatch({
    //   type: 'GetSysTemplateConfigListModel/fetch',
    //   payload: {
    //     pageIndex: 1,
    //     pageSize: 300,
    //   },
    //   callback: (data) => {
    //     const { sysTemplateTypeList = [] } = data;
    //     this.setState({ sysMenuList: sysTemplateTypeList })
    //   }
    // });


  }




  okHandle = () => {
    const { form, handleAdd, editRoleDate = {}, addType } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { addType };

      if ( addType === 'AddMembers') {
          value.userList = [{...fieldsValue}];
      } else {
        value = {...value,...fieldsValue};
      }


      // let arrays = [];
      // if ( Array.isArray(value.members) && value.members.length > 0) {
      //    value.members.forEach(item=> {
      //      if ( item.name ) {
      //       arrays.push(item.name)
      //      }
      //   })
      // }

      // if (arrays.length>0) {
      //   value.members = arrays;
      // } else {
      //   value.members = undefined
      // }


      // form.resetFields();
      handleAdd(value);


    });
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, charRoomListModel: { data }, submitting, addType } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${typeName[addType]}`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >

        {
          addType === 'AddCharRoom' ?
            (
              <Fragment>
                <FormItem {...formItemLayout} label="聊天室名称">
                  {form.getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入聊天室名称！',
                      },
                    ],
                    initialValue: editRoleDate.name,
                  })(<Input placeholder="请输入聊天室名称" />)}
                </FormItem>





                <FormItem {...formItemLayout} label="创建者用户名">
                  {form.getFieldDecorator('owner', {
                    rules: [
                      {
                        required: true,
                        message: '请输入创建者用户名！',
                      },
                    ],
                    initialValue: editRoleDate.owner,
                  })(<Input placeholder="请输入创建者用户名(创建用户的用户名)" />)}
                </FormItem>



                <FormItem {...formItemLayout} label="聊天室描述">
                  {form.getFieldDecorator('description', {
                    rules: [
                      {
                        required: false,
                        message: '请输入聊天室描述！',
                      },
                    ],
                    initialValue: editRoleDate.description,
                  })(<Input placeholder="请输入聊天室描述" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="提示">
                  <p>聊天室主要由系统创建，后台谨慎操作</p>
                </FormItem>
              </Fragment>
            ) : (

              <Fragment>
                <FormItem {...formItemLayout} label="用户名称">
                  {form.getFieldDecorator('username', {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名称！',
                      },
                    ],
                    initialValue: editRoleDate.username,
                  })(<Input placeholder="请输入名称(开头必须为字母或者数字)" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="密码" >
                  {form.getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码！',
                      },
                      {
                        min: 6,
                        message: '密码最少六个字符',
                      }
                    ],
                    initialValue: editRoleDate.password,
                  })(<Input.Password placeholder="请输入密码" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="昵称">
                  {form.getFieldDecorator('nickname', {
                    rules: [
                      {
                        required: false,
                        message: '请输入昵称！',
                      },
                    ],
                    initialValue: editRoleDate.nickname,

                  })(<Input placeholder="请输入昵称" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="用户头像">
                  {form.getFieldDecorator('avatar', {
                    rules: [
                      {
                        required: false,
                        message: '请输入用户头像！',
                      },
                    ],
                    initialValue: editRoleDate.avatar,
                  })(<UploadImg/>)}
                </FormItem>

                <FormItem {...formItemLayout} label="生日">
                  {form.getFieldDecorator('birthday', {
                    rules: [
                      {
                        required: false,
                        message: '请输入生日！',
                      },
                    ],
                    initialValue: editRoleDate.birthday,
                  })(<CustomDatePicker  format='YYYY-MM-DD'/>)}
                </FormItem>

                <FormItem {...formItemLayout} label="签名">
                  {form.getFieldDecorator('signature', {
                    rules: [
                      {
                        required: false,
                        message: '请输入签名！',
                      },
                    ],
                    initialValue: editRoleDate.signature,
                  })(<Input placeholder="请输入签名" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="性别">
                  {form.getFieldDecorator('gender', {
                    rules: [
                      {
                        required: false,
                        message: '请输入性别！',
                      },
                    ],
                    initialValue: editRoleDate.gender,
                  })(
                    <Radio.Group>
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="地区">
                  {form.getFieldDecorator('region', {
                    rules: [
                      {
                        required: false,
                        message: '请输入地区！',
                      },
                    ],
                    initialValue: editRoleDate.region,
                  })(<Input placeholder="请输入地区" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="详细地址">
                  {form.getFieldDecorator('address', {
                    rules: [
                      {
                        required: false,
                        message: '请输入详细地址！',
                      },
                    ],
                    initialValue: editRoleDate.address,
                  })(<Input placeholder="请输入详细地址" />)}
                </FormItem>

                {/* <FormItem {...formItemLayout} label="额外费用">
                  {form.getFieldDecorator('extras', {
                    rules: [
                      {
                        required: false,
                        message: '请输入额外费用！',
                      },
                    ],
                    initialValue: editRoleDate.extras,
                  })(<Input placeholder="请输入额外费用" />)}
                </FormItem> */}
              </Fragment>
            )
        }



        {/*
        <FormItem {...formItemLayout} label="成员用户名列表">
          {form.getFieldDecorator('members', {
            rules: [
              {
                required: false,
                message: '请输入成员用户名列表！',
              },
            ],
            initialValue: editRoleDate.members || [],
          })(
            <DynamicName/>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="创建时间">
          {form.getFieldDecorator('createTime', {
            rules: [
              {
                required: false,
                message: '请输入创建时间！',
              },
            ],
            initialValue: editRoleDate.createTime,
          })(<CustomDatePicker />)}
        </FormItem>

        <FormItem {...formItemLayout} label="是否禁言">
          {form.getFieldDecorator('flag', {
            rules: [
              {
                required: false,
                message: '请选择是否禁言！',
              },
            ],
            initialValue: editRoleDate.flag,
          })(
            <Radio.Group>
              <Radio value={1}>禁言</Radio>
              <Radio value={0}>不禁言</Radio>
            </Radio.Group>,
            )}
        </FormItem>


        <FormItem {...formItemLayout} label="最大成员数">
          {form.getFieldDecorator('maxMemberCount', {
            rules: [
              {
                required: false,
                message: '请输入最大成员数！',
              },
            ],
            initialValue: editRoleDate.maxMemberCount,
          })(<InputNumber placeholder="请输入最大成员数" style={{ width: "100%" }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="当前成员数">
          {form.getFieldDecorator('currentMemberCount', {
            rules: [
              {
                required: false,
                message: '请输入当前成员数！',
              },
            ],
            initialValue: editRoleDate.currentMemberCount,
          })(<InputNumber placeholder="请输入当前成员数" style={{ width: "100%" }} />)}
        </FormItem> */}







      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
