import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
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

@connect(({ GetBannerListModel, loading }) => ({
  GetBannerListModel,
  submitting: loading.effects['GetBannerListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //系统广告图列表
    modeList: [],
    isEditName: '新增',
    DictionaryState: [],
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
        const { sysPlatformList = [] } = data;
        this.setState({ sysMenuList: sysPlatformList });
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
        let modeList = list.filter(item => item.parentCode === 'RedirectType');
        let DictionaryState = list.filter(item => item.parentCode === 'DictionaryState');
        this.setState({ modeList, DictionaryState });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };

      // if(value.redirectType){
      //   value.redirectType = String(value.redirectType)
      // }

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
      GetBannerListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [], DictionaryState } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}系统广告图`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
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

        <FormItem {...formItemLayout} label="平台">
          {form.getFieldDecorator('platformById', {
            rules: [
              {
                required: true,
                message: '请选择平台',
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
              {sysMenuList.map(item => {
                return (
                  <Option value={item.pfId} key={item.pfId}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="图片">
          {form.getFieldDecorator('imgAddress', {
            rules: [
              {
                required: false,
                message: '请输入图片！',
              },
            ],
            initialValue: editRoleDate.imgAddress,
          })(<UploadImg />)}
        </FormItem>

        <FormItem {...formItemLayout} label="跳转地址">
          {form.getFieldDecorator('redirectAddress', {
            rules: [
              {
                required: false,
                message: '请输入跳转地址！',
              },
            ],
            initialValue: editRoleDate.redirectAddress,
          })(<Input placeholder="请输入跳转地址" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="跳转类型">
          {form.getFieldDecorator('redirectType', {
            rules: [
              {
                required: false,
                message: '请输入跳转类型！',
              },
            ],
            initialValue: editRoleDate.redirectType,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择跳转类型"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {modeList.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.displayName}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="是否禁用">
          {form.getFieldDecorator('status', {
            rules: [
              {
                required: false,
                message: '请选择是否禁用！',
              },
            ],
            initialValue: editRoleDate.status,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择是否禁用"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {DictionaryState.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.displayName}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="排序">
          {form.getFieldDecorator('sort', {
            rules: [
              {
                required: false,
                message: '请输入排序！',
              },
            ],
            initialValue: editRoleDate.sort,
          })(<InputNumber min={1} placeholder="请输入排序" style={{ width: '100%' }} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
