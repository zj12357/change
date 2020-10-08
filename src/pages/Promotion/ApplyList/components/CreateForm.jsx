import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker, Col, Row } from 'antd';
import React, { Component } from 'react';

import UploadImg from '@/components/Upload/UploadImg.jsx';

import { connect } from 'dva';

import { keysID, listId } from '../keys.js';

const FormItem = Form.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ ApplyListModel, loading }) => ({
  ApplyListModel,
  submitting: loading.effects['ApplyListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 系统广告图列表
    modeList: [],
    isEditName: '新增',
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
        const list = data.promotionList || [];
        this.setState({ modeList: list });
      },
    });

    dispatch({
      type: 'agentLineModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const list = data.proxyLineList || [];
        this.setState({ sysMenuList: list });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = { ...editRoleDate, ...fieldsValue };

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
      ApplyListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}申请活动`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={1000}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="选择活动">
              {form.getFieldDecorator('pid', {
                rules: [
                  {
                    required: true,
                    message: '请选择活动',
                  },
                ],
                initialValue: editRoleDate.pid,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择活动"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {modeList.map(item => (
                    <Option value={item.pid} key={item.pid}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="手机号码">
              {form.getFieldDecorator('moblie', {
                rules: [
                  {
                    required: false,
                    message: '请输入手机号码！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ],
                initialValue: editRoleDate.moblie,
              })(<Input placeholder="请输入手机号码！" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="申请IP">
              {form.getFieldDecorator('applyIP', {
                rules: [
                  {
                    required: false,
                    message: '请输入申请IP！',
                  },
                ],
                initialValue: editRoleDate.applyIP,
              })(<Input placeholder="请输入申请IP" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="申请网址">
              {form.getFieldDecorator('applyURL', {
                rules: [
                  {
                    required: false,
                    message: '请输入申请网址！',
                  },
                ],
                initialValue: editRoleDate.applyURL,
              })(<Input placeholder="请输入申请网址" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="金额">
              {form.getFieldDecorator('applyAmt', {
                rules: [
                  {
                    required: false,
                    message: '请输入金额！',
                  },
                ],
                initialValue: editRoleDate.applyAmt,
              })(<InputNumber placeholder="请输入金额！" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="申请代理线">
              {form.getFieldDecorator('plid', {
                rules: [
                  {
                    required: false,
                    message: '请选择申请代理线',
                  },
                ],
                initialValue: editRoleDate.plid,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择申请代理线">
                  {sysMenuList.map(item => (
                    <Option value={item.plid} key={item.plid}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="备注信息">
              {form.getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '请输入备注信息！',
                  },
                ],
                initialValue: editRoleDate.remark,
              })(<Input placeholder="请输入备注信息" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="申请截图地址">
              {form.getFieldDecorator('applyImage', {
                rules: [
                  {
                    required: false,
                    message: '请输入申请截图地址！',
                  },
                ],
                initialValue: editRoleDate.applyImage,
              })(<UploadImg />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
