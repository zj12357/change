import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';

import BraftEditor from '@/components/BraftEditor/BraftEditor.jsx';

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

@connect(({ GetAboutUsListModel, loading }) => ({
  GetAboutUsListModel,
  submitting: loading.effects['GetAboutUsListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //系统广告图列表
    modeList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }

    dispatch({
      type: 'GetSYSPlatformListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const list = data.sysPlatformList || [];
        this.setState({ modeList: list });
      },
    });

    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showType: 3,
        showDisabled: true,
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let sysMenuList = list.filter(item => item.parentCode === 'AboutType');
        this.setState({ sysMenuList });
      },
    });
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
      GetAboutUsListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}关于我们`}
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
                message: '请输入标题！',
              },
            ],
            initialValue: editRoleDate.title,
          })(<Input placeholder="请输入标题" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="类型">
          {form.getFieldDecorator('type', {
            rules: [
              {
                required: false,
                message: '请选择类型',
              },
            ],
            initialValue: editRoleDate.type,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择类型"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysMenuList.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.displayName}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="平台">
          {form.getFieldDecorator('platformById', {
            rules: [
              {
                required: false,
                message: '请输入平台！',
              },
            ],
            initialValue: editRoleDate.platformById,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择平台"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {modeList.map(item => {
                return (
                  <Option value={item.pfId} key={item.pfId}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: false,
                message: '请输入内容！',
              },
            ],
            initialValue: editRoleDate.content,
          })(<BraftEditor />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
