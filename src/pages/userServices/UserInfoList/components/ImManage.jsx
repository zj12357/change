import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker, message } from 'antd';
import React, { Component } from 'react';

import UploadImg from '@/components/Upload/UploadImg.jsx';


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




@connect(({ UserInfoListModel, loading }) => ({
    UserInfoListModel,
    submitting: loading.effects['UserInfoListModel/AddUserIMs'],
}))


class CreateForm extends Component {
    state = {
        sysMenuList: [], //模块配置列表
        modeList: [],
        isEditName: '新增',
    };
    componentDidMount() {
    }



    okHandle = () => {
        const { form, dispatch, handleModalVisible } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            dispatch({
                type: 'UserInfoListModel/AddUserIMs',
                payload: fieldsValue,
                callback: () => {
                    message.success('添加IM成功');
                    handleModalVisible(false);
                },
            });
            // form.resetFields();

        });
    };

    render() {
        const { modalVisible, form, handleModalVisible, editRoleDate = {}, submitting } = this.props;
        const { isEditName } = this.state;
        return (
            <Modal
                destroyOnClose
                title={`添加IM`}
                visible={modalVisible}
                onOk={this.okHandle}
                onCancel={() => handleModalVisible(false)}
                confirmLoading={submitting}
                maskClosable={false}
            >

                <FormItem {...formItemLayout} label="用户名">
                    {form.getFieldDecorator('identifier', {
                        rules: [
                            {
                                required: true,
                                message: '请输入用户名！',
                            },
                        ],
                        initialValue: editRoleDate.name,
                    })(<Input placeholder="请输入用户名" disabled />)}
                </FormItem>

                <FormItem {...formItemLayout} label="呢称">
                    {form.getFieldDecorator('nick', {
                        rules: [
                            {
                                required: true,
                                message: '请输入呢称！',
                            },
                        ],
                    })(<Input placeholder="请输入呢称" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="头像">
                    {form.getFieldDecorator('faceUrl', {
                        rules: [
                            {
                                required: true,
                                message: '请输入头像！',
                            },
                        ],
                    })(<UploadImg />)}
                </FormItem>

            </Modal>
        );
    }
}

export default Form.create()(CreateForm);
