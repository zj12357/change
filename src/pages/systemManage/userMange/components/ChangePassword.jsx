import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps, message } from 'antd';
import { getUserInfo } from '@/utils/utils.js';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;



const { TreeNode } = Tree;



const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({  loading }) => ({
  submitting: loading.effects['userMangeModel/updatePassword'],
}))

class ChangePassword extends Component {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      autoExpandParent: true, //是否自动展开父节点
      checkedKeys: [], //选中列表
      selectedKeys: [],
      expandedKeys: [],
      sysMenuList:[],
      sysUserList:[],
    };
  }

  componentDidMount() {

  }

  okHandle = () => {
    const { form, values,upDatePass, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      console.log(fieldsValue)

      dispatch({
          type: 'userMangeModel/updatePassword',
          payload: fieldsValue,
          callback:()=>{
              message.success('修改成功');
              upDatePass(false);
          }
      });

    });
  };


  render() {
    const {
      upDatePass,
      editRoleDate = {},
      modalVisible,
      submitting,
      form
    } = this.props;
    const { currentStep, formVals, checkedKeys, sysUserList = [], sysMenuList } = this.state;
    const  userData = getUserInfo();
    console.log()
    return (
      <Modal
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="修改密码"
        visible={modalVisible}
        onCancel={() => upDatePass(false)}
        afterClose={() => upDatePass(false)}
        onOk={this.okHandle}
        confirmLoading={submitting}
        maskClosable={false}
      >

         <FormItem {...formItemLayout} label="用户名">
            {form.getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
              ],
              initialValue: editRoleDate.userName,
            })(<Input  disabled  placeholder="请输入用户名" />)}
          </FormItem>



         {/* { userData.userID ===  editRoleDate.userName ?  (
          <FormItem {...formItemLayout} label="旧密码">
            {form.getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码！',
                },
              ],
              initialValue: editRoleDate.oldPassword,
            })(<Input.Password  placeholder="请输入旧密码" />)}
          </FormItem>
        )  : false} */}


        <FormItem {...formItemLayout} label="新密码">
            {form.getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码！',
                },
              ],
              initialValue: editRoleDate.newPassword,
            })(<Input.Password  placeholder="请输入新密码" />)}
        </FormItem>


      </Modal>
    );
  }
}

export default Form.create()(ChangePassword);
