import { Form, Input, InputNumber, Modal, Radio, Select, Cascader } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'antd';

import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

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

@connect(({ LotteryListModel, loading }) => ({
  LotteryListModel,
  submitting: loading.effects['LotteryListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //计划列表
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'LotteryCategoryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { lotteryCategoryList = [] } = data;
        this.setState({ sysMenuList: lotteryCategoryList });
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
      LotteryListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}开奖记录`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={900}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="计划名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入计划名称！',
                  },
                ],
                initialValue: editRoleDate.name,
              })(<Input placeholder="请输入计划名称" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="期号(number)">
              {form.getFieldDecorator('number', {
                rules: [
                  {
                    required: false,
                    message: '请输入期号！',
                  },
                ],
                initialValue: editRoleDate.number,
              })(<Input placeholder="请输入期号！" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="开奖日期">
              {form.getFieldDecorator('openDate', {
                rules: [
                  {
                    required: false,
                    message: '请输入开奖日期！',
                  },
                ],
                initialValue: editRoleDate.openDate,
              })(<CustomDatePicker />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="开奖时间">
              {form.getFieldDecorator('openTime', {
                rules: [
                  {
                    required: false,
                    message: '请输入开奖时间！',
                  },
                ],
                initialValue: editRoleDate.openTime,
              })(<CustomDatePicker />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="彩种">
              {form.getFieldDecorator('lotteryCategoryById', {
                rules: [
                  {
                    required: false,
                    message: '请选择彩种！',
                  },
                ],
                initialValue: editRoleDate.lotteryCategoryById,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择彩种！"
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
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="开奖结果">
              {form.getFieldDecorator('openNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入开奖结果！',
                  },
                ],
                initialValue: editRoleDate.openNumber,
              })(<Input placeholder="请输入开奖结果" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="直播方式">
              {form.getFieldDecorator('liveMethod', {
                rules: [
                  {
                    required: false,
                    message: '请输入直播方式！',
                  },
                ],
                initialValue: editRoleDate.liveMethod,
              })(<Input placeholder="请输入直播方式" />)}
            </FormItem>
          </Col>
          {/* <Col span={12}>
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

          </Col> */}
          <Col span={12}>
            <FormItem {...formItemLayout} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '请输入备注！',
                  },
                ],
                initialValue: editRoleDate.remark,
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
          </Col>
        </Row>

        {/* <FormItem {...formItemLayout} label="聊天室">
          {form.getFieldDecorator('chatRoom', {
            rules: [
              {
                required: false,
                message: '请输入聊天室！',
              },
            ],
            initialValue: editRoleDate.chatRoom,
          })(<Input placeholder="请输入聊天室" />)}
        </FormItem> */}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
