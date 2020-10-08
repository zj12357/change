import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component } from 'react';

import BraftEditor from '@/components/BraftEditor/BraftEditor.jsx';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

import moment from 'moment';

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

@connect(({ BannerListModel, loading }) => ({
  BannerListModel,
  submitting: loading.effects['BannerListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //广告图列表
    modeList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    // dispatch({
    //   type: 'NoticeListModel/fetch',
    //   payload: {
    //     pageIndex:1,
    //     pageSize:300,
    //   },
    //   callback:(data)=>{
    //     const { noticeList = [] } = data;
    //     this.setState({sysMenuList:noticeList})
    //   }
    // });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };
      // form.resetFields();
      handleAdd(value);
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      BannerListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}轮播图`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="标题">
          {form.getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入标题',
              },
            ],
            initialValue: editRoleDate.title,
          })(<Input placeholder="请输入标题" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="是否禁用">
          {form.getFieldDecorator('visible', {
            rules: [
              {
                required: true,
                message: '请选择！',
              },
            ],
            initialValue: editRoleDate.visible,
          })(
            <Radio.Group>
              <Radio value={true}>开启</Radio>
              <Radio value={false}>禁用</Radio>
            </Radio.Group>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入内容！',
              },
            ],
            initialValue: editRoleDate.content,
          })(<BraftEditor />)}
        </FormItem>

        {/* <FormItem {...formItemLayout} label="落地页">
          {form.getFieldDecorator('lpid', {
            rules: [
              {
                required: true,
                message: '请选择落地页',
              },
            ],
            initialValue: editRoleDate.lpid,
          })(
              <Select
                style={{ width:'100%' }}
                placeholder="请选择落地页">
                  {sysMenuList.map(item=>{
                    return (
                        <Option value={item.nid} key={item.nid}>{item.content}</Option>
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
