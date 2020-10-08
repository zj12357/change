import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';

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

class RuleConfig extends Component {
  state = {
    isContainPromotion: false, //是否包含活动金
  };
  componentDidMount() {
    const { editRoleDate = {} } = this.props;
  }

  okHandle = () => {
    const {
      form,
      handleAdd,
      editRoleDate = {},
      currentInfo = {},
      updataPromotionRule,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      /**
        { name: '用户类型', code: 'userTypeID' }, //除了这个不一样 其余全部 填的值一样
        { name: '登记', code: 'registration' },
        { name: '存款', code: 'deposit' },
        { name: '赌注', code: 'bet' },
        { name: '存款总额', code: 'depositTotal' },
        { name: '总赌注', code: 'betTotal' },
        { name: '游戏类型', code: 'gameType' },
        { name: '存款数量', code: 'depositCount' },
        { name: '首次存款', code: 'firstDeposit' },
      */
      let value = {};
      let Secondary = {
        userTypeID: null,
        registration: null,
        deposit: null,
        bet: null,
        depositTotal: null,
        betTotal: null,
        gameType: null,
        depositCount: null,
        firstDeposit: null,
      };

      const ruleType = currentInfo.code;
      if (ruleType === 'userTypeID') {
        //除了用户类型 其余全部一样
        Secondary.userTypeID = fieldsValue.userTypeID;
      } else {
        Secondary[ruleType] = {
          userTypeRuleID: fieldsValue.userTypeRuleID,
          maximum: fieldsValue.maximum,
          minimum: fieldsValue.minimum,
        };
      }
      // console.log('value', value, Secondary);
      // form.resetFields();
      updataPromotionRule(Secondary);
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      currentInfo = {},
    } = this.props;
    const { VisibleBetrothal = false, isContainPromotion = false } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${currentInfo.displayName}验证规则`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        maskClosable={false}
        width={650}
      >
        {/* 用户类型  userTypeID  */}
        {currentInfo.code === 'userTypeID' ? (
          <Fragment>
            <FormItem {...formItemLayout} label="用户类型">
              {form.getFieldDecorator('userTypeID', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户类型',
                  },
                ],
                initialValue: editRoleDate.userTypeID,
              })(<Input placeholder="请输入用户类型" />)}
            </FormItem>
          </Fragment>
        ) : (
          <Fragment>
            <FormItem {...formItemLayout} label="规则明细ID">
              {form.getFieldDecorator('userTypeRuleID', {
                rules: [
                  {
                    required: false,
                    message: '请输入规则明细ID！',
                  },
                ],
                initialValue: editRoleDate.userTypeRuleID,
              })(<InputNumber placeholder="请输入规则明细ID" style={{ width: '100%' }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="最大值">
              {form.getFieldDecorator('maximum', {
                rules: [
                  {
                    required: false,
                    message: '请输入最大值！',
                  },
                ],
                initialValue: editRoleDate.maximum,
              })(<InputNumber placeholder="请输入最大值" style={{ width: '100%' }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="最小值">
              {form.getFieldDecorator('minimum', {
                rules: [
                  {
                    required: false,
                    message: '请输入最小值！',
                  },
                ],
                initialValue: editRoleDate.minimum,
              })(<InputNumber placeholder="请输入最小值" style={{ width: '100%' }} />)}
            </FormItem>
          </Fragment>
        )}
      </Modal>
    );
  }
}

export default Form.create()(RuleConfig);
