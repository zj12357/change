import { Form, Input, InputNumber, Modal, Radio, Select, Cascader, Col, Row } from 'antd';
import React, { Component } from 'react';

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

@connect(({ LotteryRecordListModel, loading }) => ({
  LotteryRecordListModel,
  submitting: loading.effects['LotteryRecordListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //预测记录列表
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'LotteryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { lotteryList = [] } = data;
        this.setState({ sysMenuList: lotteryList });
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
      LotteryRecordListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}预测记录`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={1100}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="预测人">
              {form.getFieldDecorator('userByName', {
                rules: [
                  {
                    required: true,
                    message: '请输入预测人！',
                  },
                ],
                initialValue: editRoleDate.userByName,
              })(<Input placeholder="请输入预测人" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="预测彩票">
              {form.getFieldDecorator('lotteryById', {
                rules: [
                  {
                    required: true,
                    message: '请输入预测彩票！',
                  },
                ],
                initialValue: editRoleDate.lotteryById,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择！"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {sysMenuList.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.name} ：期号-({item.number})
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="特推号码">
              {form.getFieldDecorator('pointNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入特推号码！',
                  },
                ],
                initialValue: editRoleDate.pointNumber,
              })(<Input placeholder="请输入特推号码" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="推荐号码">
              {form.getFieldDecorator('recommendNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入推荐号码！',
                  },
                ],
                initialValue: editRoleDate.recommendNumber,
              })(<Input placeholder="请输入推荐号码" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="数字结果">
              {form.getFieldDecorator('result', {
                rules: [
                  {
                    required: false,
                    message: '请输入数字结果！',
                  },
                ],
                initialValue: editRoleDate.result,
              })(<Input placeholder="请输入数字结果" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="红单率">
              {form.getFieldDecorator('accuracy', {
                rules: [
                  {
                    required: false,
                    message: '请输入红单率！',
                  },
                ],
                initialValue: editRoleDate.accuracy,
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入红单率！" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="玩法">
              {form.getFieldDecorator('playMethod', {
                rules: [
                  {
                    required: false,
                    message: '请输入玩法！',
                  },
                ],
                initialValue: editRoleDate.playMethod,
              })(<Input.TextArea placeholder="请输入玩法" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="连续命中数">
              {form.getFieldDecorator('straightHit', {
                rules: [
                  {
                    required: false,
                    message: '请输入连续命中数！',
                  },
                ],
                initialValue: editRoleDate.straightHit,
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入连续命中数！" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="总推荐量">
              {form.getFieldDecorator('recommendTotal', {
                rules: [
                  {
                    required: false,
                    message: '请输入总推荐量！',
                  },
                ],
                initialValue: editRoleDate.recommendTotal,
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入总推荐量！" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="龙虎结果">
              {form.getFieldDecorator('resultText', {
                rules: [
                  {
                    required: false,
                    message: '请输入龙虎结果！',
                  },
                ],
                initialValue: editRoleDate.resultText,
              })(<Input placeholder="请输入龙虎结果" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="冠亚结果">
              {form.getFieldDecorator('resultCrown', {
                rules: [
                  {
                    required: false,
                    message: '请输入冠亚结果！',
                  },
                ],
                initialValue: editRoleDate.resultCrown,
              })(<Input placeholder="请输入冠亚结果" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="单双结果">
              {form.getFieldDecorator('resultOddEven', {
                rules: [
                  {
                    required: false,
                    message: '请输入单双结果！',
                  },
                ],
                initialValue: editRoleDate.resultOddEven,
              })(<Input placeholder="请输入单双结果" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="大小结果">
              {form.getFieldDecorator('resultSize', {
                rules: [
                  {
                    required: false,
                    message: '请输入大小结果！',
                  },
                ],
                initialValue: editRoleDate.resultSize,
              })(<Input placeholder="请输入大小结果" />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
