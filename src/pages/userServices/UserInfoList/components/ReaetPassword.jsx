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
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

@connect(({ loading }) => ({
    submitting: loading.effects['UserInfoListModel/updatePassword'],
}))

class ChangePassword extends Component {
    static defaultProps = {
        handleUpdate: () => { },
        handleUpdateModalVisible: () => { },
        values: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            autoExpandParent: true, //是否自动展开父节点
            checkedKeys: [], //选中列表
            selectedKeys: [],
            expandedKeys: [],
            sysMenuList: [],
            sysUserList: [],
        };
    }

    componentDidMount() {

    }

    okHandle = () => {
        const { form, values, upDatePass, dispatch,passValue } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            if (fieldsValue.newPassword !== fieldsValue.newPassword2) {
                message.error('新密码和二次密码不一致');
                return false;
            }

            dispatch({
                type: 'UserInfoListModel/updatePassword',
                payload: {
                    ...fieldsValue,
                    userId:passValue.id,
                },
                callback: () => {
                    message.success('重置成功');
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
        console.log()
        return (
            <Modal
                bodyStyle={{
                    padding: '32px 40px 48px',
                }}
                destroyOnClose
                title="重置密码"
                visible={modalVisible}
                onCancel={() => upDatePass(false)}
                afterClose={() => upDatePass(false)}
                onOk={this.okHandle}
                confirmLoading={submitting}
                maskClosable={false}
            >

                <FormItem {...formItemLayout} label="新密码">
                    {form.getFieldDecorator('newPassword', {
                        rules: [
                            {
                                required: true,
                                message: '请输入新密码！',
                            },
                        ],
                        // initialValue: editRoleDate.newPassword,
                    })(<Input  placeholder="请输入新密码" />)}
                </FormItem>


                <FormItem {...formItemLayout} label="再次输入密码">
                    {form.getFieldDecorator('newPassword2', {
                        rules: [
                            {
                                required: true,
                                message: '请再次输入密码！',
                            },
                        ],
                        initialValue: editRoleDate.newPassword2,
                    })(<Input.Password placeholder="请再次输入密码" />)}
                </FormItem>


            </Modal>
        );
    }
}

export default Form.create()(ChangePassword);
