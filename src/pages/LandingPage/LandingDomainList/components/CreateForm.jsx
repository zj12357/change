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

@connect(({ LandingDomainListModel, loading }) => ({
  LandingDomainListModel,
  submitting: loading.effects['LandingDomainListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //广告图列表
    modeList: [],
    isEditName: '新增',
    promotionList: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'PromotionListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { promotionList = [] } = data;
        this.setState({ promotionList: promotionList });
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
      LandingDomainListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, promotionList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}落地页域名`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        {/* <FormItem {...formItemLayout} label="是否禁用">
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
        </FormItem> */}

        <FormItem {...formItemLayout} label="域名">
          {form.getFieldDecorator('domainName', {
            rules: [
              {
                required: true,
                message: '请输入域名！',
              },
            ],
            initialValue: editRoleDate.domainName,
          })(<Input placeholder="请输入域名！" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="域名地址">
          {form.getFieldDecorator('domainAddress', {
            rules: [
              {
                required: true,
                message: '请输入域名地址！',
              },
            ],
            initialValue: editRoleDate.domainAddress,
          })(<Input placeholder="请输入域名地址！" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="活动">
          {form.getFieldDecorator('promotionList', {
            rules: [
              {
                required: true,
                message: '请选择落地页',
              },
            ],
            initialValue: editRoleDate.promotionList,
          })(
            <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择落地页">
              {promotionList.map((item, index) => {
                return (
                  <Option value={item.pid} key={index}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入备注！',
              },
            ],
            initialValue: editRoleDate.remark,
          })(<Input placeholder="请输入备注！" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
