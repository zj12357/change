import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker,Spin } from 'antd';
import React, { Component } from 'react';

import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx'

import debounce from 'lodash/debounce';
import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

import moment from 'moment'

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




@connect(({ charRoomDetailsModel, loading }) => ({
  charRoomDetailsModel,
  submitting: loading.effects['charRoomDetailsModel/add'],
  searchLoading: loading.effects['charRoomDetailsModel/GetUserInfoLists'],
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
    //   type: 'charRoomDetailsModel/GetUserInfoLists',
    //   payload: {
    //     pageIndex: 1,
    //     pageSize: 300,
    //   },
    //   callback: (data) => {
    //     const { cmUserInfoList = [] } = data;
    //     this.setState({ sysMenuList: cmUserInfoList })
    //   }
    // });

  }

  // 搜索用户
  getSerachUser = name => {
    if (!name) return;
    const { dispatch, editRoleDate = {}, type } = this.props;
    dispatch({
      type: 'charRoomDetailsModel/GetUserInfoLists',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ sysMenuList: data.cmUserInfoList || [] });
      },
    });
  }



  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...fieldsValue };

      // form.resetFields();
      handleAdd(value);


    });
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, charRoomDetailsModel: { data }, submitting, searchLoading } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`发送系统消息`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >

        <FormItem {...formItemLayout} label="内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入内容！',
              },
            ],
          })(<Input placeholder="请输入内容" />)}
        </FormItem>

        <FormItem {...formItemLayout} label='用户'>
          {form.getFieldDecorator('toMembers_Account', {
            rules: [
              {
                required: false,
                message: '请选择用户',
              },
            ],
            initialValue: [],
          })(
            // <Select
            //   style={{ width: '100%' }}
            //   mode="multiple"
            //   allowClear
            //   placeholder="请选择(查询用户列表)不填则发送所有人">
            //   {sysMenuList.map(item => {
            //     return (
            //       <Option value={item.name} key={item.name}>{item.name}</Option>
            //     )
            //   })
            //   }
            // </Select>
            <Select
              mode="multiple"
              showSearch
              notFoundContent={searchLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={debounce(this.getSerachUser, 1000)}
              style={{ width: '100%' }}
              placeholder="请输入用户名称搜索用户(不填则发送所有人)"
              loading={searchLoading}
            >
              {sysMenuList.map(item => (
                <Option value={item.name} key={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>

        {/* <FormItem {...formItemLayout} label="用户名称">
          {form.getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入用户名称！',
              },
            ],
            initialValue: editRoleDate.username,
          })(<Input placeholder="请输入用户名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="密码" >
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: false,
                message: '请输入密码！',
              },
              {
                min:6,
                message:'密码最少六个字符',
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

        <FormItem {...formItemLayout} label="化身">
          {form.getFieldDecorator('avatar', {
            rules: [
              {
                required: false,
                message: '请输入化身！',
              },
            ],
            initialValue: editRoleDate.avatar,
          })(<Input placeholder="请输入化身" />)}
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
          })(<Input placeholder="请输入生日" />)}
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
              <Radio value={0}>女</Radio>
            </Radio.Group>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="区域">
          {form.getFieldDecorator('region', {
            rules: [
              {
                required: false,
                message: '请输入区域！',
              },
            ],
            initialValue: editRoleDate.region,
          })(<Input placeholder="请输入区域" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="地址">
          {form.getFieldDecorator('address', {
            rules: [
              {
                required: false,
                message: '请输入地址！',
              },
            ],
            initialValue: editRoleDate.address,
          })(<Input placeholder="请输入地址" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="额外费用">
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



        {/* <FormItem {...formItemLayout} label="创建时间">
          {form.getFieldDecorator('createTime', {
            rules: [
              {
                required: false,
                message: '请输入创建时间！',
              },
            ],
            initialValue: editRoleDate.createTime,
          })(<CustomDatePicker />)}
        </FormItem> */}

      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
