import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker, Col, Row } from 'antd';
import React, { Component, Fragment } from 'react';

import UploadImg from '@/components/Upload/UploadImg.jsx';

import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';

import { connect } from 'dva';

import BraftEditor from '@/components/BraftEditor/BraftEditor.jsx';
import RuleConfig from './RuleConfig.jsx'; // 彩金规则配置
import FormData from './FormData.jsx'; //表单内容
import { keysID, listId } from '../keys.js';

import { stringTurnArr, genID } from '@/utils/utils.js';

const FormItem = Form.Item;

const { Option } = Select;

// Array Object
function analysisJson(str, type = 'Object') {
  let objs = type === 'Object' ? {} : [];
  try {
    objs = JSON.parse(str);
  } catch (error) {
    console.log('解析json失败', error, str);
  }
  if (Object.prototype.toString.call(objs) === `[object ${type}]`) {
    return objs;
  }
  return type === 'Object' ? {} : [];
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const formItemLayout1 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

@connect(({ PromotionListModel, loading }) => ({
  PromotionListModel,
  submitting: loading.effects['PromotionListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 活动分类
    modeList: [], // 彩金分类列表
    isEditName: '新增',
    currentInfo: {}, // 当前选择彩金对象
    VisibleBetrothal: false,
    editRoleDateRule: {},
    VisibleFormData: false,
    formDataInfo: [],
    AuditType: [],
  };

  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }

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
        const modeList = list.filter(item => item.parentCode === 'PromotionBonusType');
        const sysMenuList = list.filter(item => item.parentCode === 'PromotionType');
        let AuditType = list.filter(item => item.parentCode === 'AuditType');
        this.setState({ modeList, sysMenuList, AuditType });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = { ...editRoleDate, ...fieldsValue };

      if (value.promotionRule) {
        value.promotionRule = analysisJson(value.promotionRule);
      }
      if (value.bonusTypeID) {
        value.bonusTypeID = value.bonusTypeID.join(',');
      }

      if (value.formData) {
        value.formData = analysisJson(value.formData, 'Array');
      }

      // form.resetFields();
      handleAdd(value);
    });
  };

  onDeselect = val => {
    const { form } = this.props;
    const { modeList = [] } = this.state;
    const filtArr = modeList.filter(item => item.code === val);
    if (filtArr.length < 0) return;
    const currentInfo = filtArr[0];
    let promotionRule = form.getFieldValue('promotionRule');
    promotionRule = analysisJson(promotionRule); // 解析json
    promotionRule = {
      registerBonus: null,
      firstDepositBonus: null,
      flowBonus: null,
      betBonus: null,
      winBonus: null,
      depositBonus: null,
      multipleDepositBonus: null,
      onlineBonus: null,
      vipBonus: null,
      ...promotionRule,
    };
    switch (currentInfo.code) {
      // 注册彩金  RegisterBonus
      case 'RegisterBonus':
        promotionRule.registerBonus = null;
        break;
      // 首存金额  FirstDepositBonus
      case 'FirstDepositBonus':
        promotionRule.firstDepositBonus = null;
        break;
      // 流水金额  FlowBonus
      case 'FlowBonus':
        promotionRule.flowBonus = null;
        break;
      // 投注彩金  BetBonus
      case 'BetBonus':
        promotionRule.betBonus = null;
        break;
      // 输赢彩金  WinBonus
      case 'WinBonus':
        const winBonus = promotionRule.winBonus || {};
        promotionRule.winBonus = null;
        break;
      // 存款彩金  DepositBonus
      case 'DepositBonus':
        promotionRule.depositBonus = null;
        break;
      // 复存彩金  MultipleDepositBonus
      case 'MultipleDepositBonus':
        promotionRule.multipleDepositBonus = null;
        break;
      // 在线彩金  OnlineBonus
      case 'OnlineBonus':
        promotionRule.onlineBonus = null;
        break;
      // VIP彩金  VipBonus
      case 'VipBonus':
        promotionRule.vipBonus = null;
        break;
    }
    form.setFieldsValue({
      promotionRule: JSON.stringify(promotionRule || {}),
    });
  };

  bonusType = val => {
    const { form } = this.props;
    const { modeList = [] } = this.state;
    const filtArr = modeList.filter(item => item.code === val);
    if (filtArr.length < 0) return;
    const currentInfo = filtArr[0];
    let promotionRule = form.getFieldValue('promotionRule');
    promotionRule = analysisJson(promotionRule); // 解析json
    let value = {};
    switch (currentInfo.code) {
      // 注册彩金  RegisterBonus
      case 'RegisterBonus':
        value = promotionRule.registerBonus || {};
        // Secondary.registerBonus = value;
        break;
      // 首存金额  FirstDepositBonus
      case 'FirstDepositBonus':
        const firstDepositBonus = promotionRule.firstDepositBonus || {};
        value = {
          containPromotion: firstDepositBonus.containPromotion,
          maximum: firstDepositBonus.range && firstDepositBonus.range.maximum,
          minimum: firstDepositBonus.range && firstDepositBonus.range.minimum,
        };
        // Secondary.firstDepositBonus = value;
        break;
      // 流水金额  FlowBonus
      case 'FlowBonus':
        const flowBonus = promotionRule.flowBonus || {};
        value = {
          gameName: flowBonus.gameName,
          maximum: flowBonus.range && flowBonus.range.maximum,
          minimum: flowBonus.range && flowBonus.range.minimum,
          startTime: flowBonus.period && flowBonus.period.startTime,
          endTime: flowBonus.period && flowBonus.period.endTime,
        };
        // Secondary.flowBonus = value;
        break;
      // 投注彩金  BetBonus
      case 'BetBonus':
        const betBonus = promotionRule.betBonus || {};
        value = {
          ...betBonus,
          maximum: betBonus.range && betBonus.range.maximum,
          minimum: betBonus.range && betBonus.range.minimum,
          startTime: betBonus.period && betBonus.period.startTime,
          endTime: betBonus.period && betBonus.period.endTime,
        };
        // Secondary.betBonus = value;
        break;
      // 输赢彩金  WinBonus
      case 'WinBonus':
        const winBonus = promotionRule.winBonus || {};
        value = {
          gameName: winBonus.gameName,
          maximum: winBonus.range && winBonus.range.maximum,
          minimum: winBonus.range && winBonus.range.minimum,
          startTime: winBonus.period && winBonus.period.startTime,
          endTime: winBonus.period && winBonus.period.endTime,
        };
        // Secondary.winBonus = value;
        break;
      // 存款彩金  DepositBonus
      case 'DepositBonus':
        const depositBonus = promotionRule.depositBonus || {};
        value = {
          containPromotion: depositBonus.containPromotion,
          maximum: depositBonus.range && depositBonus.range.maximum,
          minimum: depositBonus.range && depositBonus.range.minimum,
          startTime: depositBonus.period && depositBonus.period.startTime,
          endTime: depositBonus.period && depositBonus.period.endTime,
        };
        // Secondary.depositBonus = value;
        break;
      // 复存彩金  MultipleDepositBonus
      case 'MultipleDepositBonus':
        const multipleDepositBonus = promotionRule.multipleDepositBonus || {};
        value = {
          times: multipleDepositBonus.times,
          maximum: multipleDepositBonus.range && multipleDepositBonus.range.maximum,
          minimum: multipleDepositBonus.range && multipleDepositBonus.range.minimum,
          startTime: multipleDepositBonus.period && multipleDepositBonus.period.startTime,
          endTime: multipleDepositBonus.period && multipleDepositBonus.period.endTime,
        };
        // Secondary.multipleDepositBonus = value;
        break;
      // 在线彩金  OnlineBonus
      case 'OnlineBonus':
        const onlineBonus = promotionRule.onlineBonus || {};
        value = {
          days: onlineBonus.days,
          isContinuous: onlineBonus.isContinuous,
          startTime: onlineBonus.period && onlineBonus.period.startTime,
          endTime: onlineBonus.period && onlineBonus.period.endTime,
        };
        // Secondary.onlineBonus = value;
        break;
      // VIP彩金  VipBonus
      case 'VipBonus':
        const vipBonus = promotionRule.vipBonus || {};
        value = {
          maximum: vipBonus.range && vipBonus.range.maximum,
          minimum: vipBonus.range && vipBonus.range.minimum,
          startTime: vipBonus.period && vipBonus.period.startTime,
          endTime: vipBonus.period && vipBonus.period.endTime,
        };
        // Secondary.vipBonus = value;
        break;
    }
    // console.log('currentInfo', currentInfo, 'promotionRule', promotionRule, value)
    this.setState({ currentInfo, VisibleBetrothal: true, editRoleDateRule: value, promotionRule });
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

  openFormdata = flag => {
    if (!!!flag) {
      this.setState({ VisibleFormData: !!flag, formDataInfo: [] });
      return false;
    }
    let formDataInfo = this.props.form.getFieldValue('formData');
    formDataInfo = analysisJson(formDataInfo, 'Array'); // 解析json
    this.setState({ VisibleFormData: !!flag, formDataInfo });
  };

  setFormdata = record => {
    this.props.form.setFieldsValue({
      formData: JSON.stringify(record || []),
    });
    this.openFormdata(false);
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      PromotionListModel: { data },
      submitting,
    } = this.props;
    const {
      isEditName,
      sysMenuList = [],
      modeList = [],
      currentInfo = {},
      VisibleBetrothal = false,
      editRoleDateRule = {},
      promotionRule = {},
      VisibleFormData,
      formDataInfo,
      AuditType,
    } = this.state;

    return (
      <Fragment>
        {VisibleBetrothal && (
          <RuleConfig
            modalVisible={VisibleBetrothal}
            handleModalVisible={this.updataRuleVisib}
            editRoleDate={{}}
            currentInfo={currentInfo}
            updataPromotionRule={this.updataPromotionRule}
            promotionRule={promotionRule}
            editRoleDate={editRoleDateRule}
          />
        )}

        {VisibleFormData && (
          <FormData
            modalVisible={VisibleFormData}
            handleModalVisible={this.openFormdata}
            editRoleDate={formDataInfo}
            updataPromotionRule={this.setFormdata}
          />
        )}

        <Modal
          destroyOnClose
          title={`${isEditName}活动`}
          visible={modalVisible}
          onOk={this.okHandle}
          onCancel={() => handleModalVisible()}
          confirmLoading={submitting}
          maskClosable={false}
          width={950}
        >
          <Row gutter={24}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="开始日期">
                {form.getFieldDecorator('startdate', {
                  rules: [
                    {
                      required: false,
                      message: '请输入开始日期！',
                    },
                  ],
                  initialValue: editRoleDate.startdate,
                })(<CustomDatePicker />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="结束日期">
                {form.getFieldDecorator('enddate', {
                  rules: [
                    {
                      required: false,
                      message: '请输入结束日期！',
                    },
                  ],
                  initialValue: editRoleDate.enddate,
                })(<CustomDatePicker />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="通知间隔时长">
                {form.getFieldDecorator('informInterval', {
                  rules: [
                    {
                      required: false,
                      message: '请输入申请通知间隔时长！',
                    },
                  ],
                  initialValue: editRoleDate.informInterval,
                })(
                  <InputNumber
                    min={1}
                    placeholder="请输入申请通知间隔时长"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="彩金分类">
                {form.getFieldDecorator('bonusTypeID', {
                  rules: [
                    {
                      required: false,
                      message: '请选择彩金分类',
                    },
                  ],
                  initialValue: stringTurnArr(editRoleDate.bonusTypeID),
                })(
                  <Select
                    style={{ width: '100%' }}
                    onSelect={this.bonusType}
                    onDeselect={this.onDeselect}
                    placeholder="请选择彩金分类"
                    mode="multiple"
                    getPopupContainer={triggerNode => {
                      return triggerNode.parentNode || document.body;
                    }}
                  >
                    {modeList.map(item => (
                      <Option value={item.code} key={item.code}>
                        {item.displayName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="验证规则">
                {form.getFieldDecorator('promotionRule', {
                  rules: [
                    {
                      required: false,
                      message: '请输入验证规则！',
                    },
                  ],
                  initialValue: editRoleDate.promotionRule,
                })(<Input.TextArea placeholder="请输入验证规则" readOnly />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="审核类型">
                {form.getFieldDecorator('auditType', {
                  rules: [
                    {
                      required: false,
                      message: '请选择审核类型',
                    },
                  ],
                  initialValue: editRoleDate.auditType,
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择审核类型"
                    getPopupContainer={triggerNode => {
                      return triggerNode.parentNode || document.body;
                    }}
                  >
                    {AuditType.map((item, index) => (
                      <Option value={item.code} key={index}>
                        {item.displayName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="活动类型">
                {form.getFieldDecorator('promotionTypeID', {
                  rules: [
                    {
                      required: false,
                      message: '请选择活动类型',
                    },
                  ],
                  initialValue: editRoleDate.promotionTypeID,
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择活动类型"
                    getPopupContainer={triggerNode => {
                      return triggerNode.parentNode || document.body;
                    }}
                  >
                    {sysMenuList.map(item => (
                      <Option value={item.code} key={item.code}>
                        {item.displayName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="活动对象">
                {form.getFieldDecorator('promotionObject', {
                  rules: [
                    {
                      required: false,
                      message: '请输入活动对象！',
                    },
                  ],
                  initialValue: editRoleDate.promotionObject,
                })(<Input.TextArea placeholder="请输入活动对象" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="是否带表单">
                {form.getFieldDecorator('isForm', {
                  rules: [
                    {
                      required: false,
                      message: '请输入是否带表单！',
                    },
                  ],
                  initialValue: editRoleDate.isForm,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="表单内容">
                {form.getFieldDecorator('formData', {
                  rules: [
                    {
                      required: false,
                      message: '请输入表单内容！',
                    },
                  ],
                  initialValue: editRoleDate.formData,
                })(
                  <Input.TextArea
                    placeholder="请输入表单内容"
                    readOnly
                    onClick={this.openFormdata}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="活动图片">
                {form.getFieldDecorator('image', {
                  rules: [
                    {
                      required: false,
                      message: '请上传活动图片！',
                    },
                  ],
                  initialValue: editRoleDate.image,
                })(<UploadImg />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <FormItem {...formItemLayout1} label="活动内容">
                {form.getFieldDecorator('promotionContent', {
                  rules: [
                    {
                      required: false,
                      message: '请输入活动内容！',
                    },
                  ],
                  initialValue: editRoleDate.promotionContent,
                })(<BraftEditor />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={18}>
              <FormItem {...formItemLayout1} label="活动表格">
                {form.getFieldDecorator('promotionTable', {
                  rules: [
                    {
                      required: false,
                      message: '请输入活动表格！',
                    },
                  ],
                  initialValue: editRoleDate.promotionTable,
                })(<BraftEditor />)}
              </FormItem>
            </Col>
          </Row>

          {/* <FormItem {...formItemLayout} label="状态">
            {form.getFieldDecorator('status', {
              rules: [
                {
                  required: false,
                  message: '请输入状态！',
                },
              ],
              initialValue: editRoleDate.status,
            })(<InputNumber  placeholder="请输入状态！" style={{ width: "100%" }} />)}
          </FormItem> */}
        </Modal>
      </Fragment>
    );
  }
}

export default Form.create()(CreateForm);
