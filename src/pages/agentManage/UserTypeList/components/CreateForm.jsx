import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker, Col, Row } from 'antd';
import React, { Component, Fragment } from 'react';

import { connect } from 'dva';

import RuleConfig from './RuleConfig.jsx'; // 彩金规则配置

import { keysID, listId } from '../keys.js';

const FormItem = Form.Item;

const { Option } = Select;

function analysisJson(str) {
  let objs = {};
  try {
    objs = JSON.parse(str);
  } catch (error) {
    console.log('解析json失败', error, str);
  }
  if (Object.prototype.toString.call(objs) === '[object Object]') {
    return objs;
  }
  return {};
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ UserTypeListModel, loading }) => ({
  UserTypeListModel,
  submitting: loading.effects['UserTypeListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 活动分类
    modeList: [], // 彩金分类列表
    isEditName: '新增',
    currentInfo: {}, // 当前选择彩金对象
    VisibleBetrothal: false,
    editRoleDateRule: {},
    PDUserType: [],
  };

  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    this.getStatusList();
  }

  getStatusList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showDisabled: true,
        showType: 3,
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let PDUserType = list.filter(item => item.parentCode === 'PDUserType');
        this.setState({ PDUserType });
      },
    });
  };

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = { ...editRoleDate, ...fieldsValue };

      if (value.promotionRule) {
        value.rule = analysisJson(value.promotionRule);
      }
      // form.resetFields();
      handleAdd(value);
    });
  };

  bonusType = val => {
    const { form } = this.props;
    const { PDUserType = [] } = this.state;
    const filtArr = PDUserType.filter(item => item.code === val);
    if (filtArr.length < 0) return;
    const currentInfo = filtArr[0];
    let promotionRule = form.getFieldValue('promotionRule');

    promotionRule = analysisJson(promotionRule); // 解析json

    let value = {};
    const ruleType = currentInfo.code;

    if (ruleType === 'userTypeID') {
      //除了用户类型 其余全部一样
      value = {
        userTypeID: promotionRule.userTypeID,
      };
    } else {
      const registration = promotionRule[ruleType] || {};
      value = {
        userTypeRuleID: registration.userTypeRuleID,
        maximum: registration.maximum,
        minimum: registration.minimum,
      };
    }
    // console.log('currentInfo', currentInfo, 'promotionRule', promotionRule, value)
    this.setState({ currentInfo, VisibleBetrothal: true, editRoleDateRule: value });
  };

  updataRuleVisib = flag => {
    this.setState({ VisibleBetrothal: !!flag });
  };

  updataPromotionRule = record => {
    this.props.form.setFieldsValue({
      promotionRule: JSON.stringify(record || {}),
    });
    this.updataRuleVisib(false);
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      UserTypeListModel: { data },
      submitting,
    } = this.props;
    const {
      isEditName,
      sysMenuList = [],
      modeList = [],
      currentInfo = {},
      VisibleBetrothal = false,
      editRoleDateRule = {},
      PDUserType = [],
    } = this.state;
    return (
      <Fragment>
        <RuleConfig
          modalVisible={VisibleBetrothal}
          handleModalVisible={this.updataRuleVisib}
          editRoleDate={{}}
          currentInfo={currentInfo}
          updataPromotionRule={this.updataPromotionRule}
          editRoleDate={editRoleDateRule}
        />

        <Modal
          destroyOnClose
          title={`${isEditName}用户类型`}
          visible={modalVisible}
          onOk={this.okHandle}
          onCancel={() => handleModalVisible()}
          confirmLoading={submitting}
          maskClosable={false}
        >
          <Row gutter={24}>
            <FormItem {...formItemLayout} label="名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称！',
                  },
                ],
                initialValue: editRoleDate.name,
              })(<Input placeholder="请输入名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="权重">
              {form.getFieldDecorator('level', {
                rules: [
                  {
                    required: false,
                    message: '请输入权重！',
                  },
                ],
                initialValue: editRoleDate.level,
              })(<InputNumber placeholder="请输入权重" style={{ width: '100%' }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="用户类型规则">
              {form.getFieldDecorator('rule', {
                rules: [
                  {
                    required: false,
                    message: '请选择用户类型规则',
                  },
                ],
                // initialValue: editRoleDate.rule,
              })(
                <Select
                  style={{ width: '100%' }}
                  onSelect={this.bonusType}
                  placeholder="请选择用户类型规则"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {PDUserType.map(item => (
                    <Option value={item.code} key={item.code}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="验证规则">
              {form.getFieldDecorator('promotionRule', {
                rules: [
                  {
                    required: false,
                    message: '请输入验证规则！',
                  },
                ],
                initialValue: editRoleDate.rule,
              })(<Input.TextArea autoSize placeholder="请输入验证规则" readOnly />)}
            </FormItem>
          </Row>
        </Modal>
      </Fragment>
    );
  }
}

export default Form.create()(CreateForm);
