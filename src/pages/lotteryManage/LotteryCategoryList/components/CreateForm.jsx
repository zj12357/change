import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
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

@connect(({ LotteryCategoryListModel, loading }) => ({
  LotteryCategoryListModel,
  submitting: loading.effects['LotteryCategoryListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //彩种列表
    lotteryFeatureList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'LotteryTypeListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { lotteryTypeList = [] } = data;
        this.setState({ sysMenuList: lotteryTypeList });
      },
    });

    dispatch({
      type: 'LotteryFeatureListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { lotteryFeatureList = [] } = data;
        this.setState({ lotteryFeatureList: lotteryFeatureList });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // form.resetFields();
      handleAdd({ ...editRoleDate, ...fieldsValue });
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      LotteryCategoryListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], lotteryFeatureList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}彩种`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="彩种名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入彩种名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入彩种名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="彩种分类">
          {form.getFieldDecorator('lotteryTypeById', {
            rules: [
              {
                required: true,
                message: '请选择彩种分类',
              },
            ],
            initialValue: editRoleDate.lotteryTypeById,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择彩种分类"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysMenuList.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="彩种特性">
          {form.getFieldDecorator('lotteryFeatureById', {
            rules: [
              {
                required: false,
                message: '请选择彩种特性',
              },
            ],
            initialValue: editRoleDate.lotteryFeatureById,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择彩种特性"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {lotteryFeatureList.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="当前结果">
          {form.getFieldDecorator('openNumber', {
            rules: [
              {
                required: false,
                message: '请输入当前结果！',
              },
            ],
            initialValue: editRoleDate.openNumber,
          })(<Input placeholder="请输入当前结果" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="总期数">
          {form.getFieldDecorator('total', {
            rules: [
              {
                required: false,
                message: '请输入总期数！',
              },
            ],
            initialValue: editRoleDate.total,
          })(<InputNumber placeholder="请输入总期数！" style={{ width: '100%' }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="图标">
          {form.getFieldDecorator('img', {
            rules: [
              {
                required: false,
                message: '请输入图标！',
              },
            ],
            initialValue: editRoleDate.img,
          })(<UploadImg />)}
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

        <FormItem {...formItemLayout} label="聊天室">
          {form.getFieldDecorator('chatRoom', {
            rules: [
              {
                required: false,
                message: '请输入聊天室！',
              },
            ],
            initialValue: editRoleDate.chatRoom,
          })(<Input placeholder="请输入聊天室" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="是否推荐">
          {form.getFieldDecorator('isReferrals', {
            rules: [
              {
                required: false,
                message: '请输入是否推荐！',
              },
            ],
            initialValue: editRoleDate.isReferrals,
          })(
            <Radio.Group>
              <Radio value={true}>推荐</Radio>
              <Radio value={false}>不推荐</Radio>
            </Radio.Group>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
