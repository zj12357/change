import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';



import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx'


import { keysID, listId } from './../keys.js';

import moment from 'moment'

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
    isContainPromotion: false,//是否包含活动金
  };
  componentDidMount() {
    const { editRoleDate = {} } = this.props;
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {}, currentInfo = {}, updataPromotionRule,promotionRule={} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.log('fieldsValue', fieldsValue);
      let value = {};
      let Secondary = {
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
          value = fieldsValue;
          Secondary.registerBonus = value;
          break;
        // 首存金额  FirstDepositBonus 
        case 'FirstDepositBonus':
          // if (fieldsValue.containPromotion) {
          value = {
            containPromotion: fieldsValue.containPromotion,
            range: {
              maximum: fieldsValue.maximum,
              minimum: fieldsValue.minimum,
            }
          };
          // }
          // if (fieldsValue.containPromotion === false) {
          //   value.containPromotion = false;
          // }
          Secondary.firstDepositBonus = value;
          break;
        // 流水金额  FlowBonus 
        case 'FlowBonus':
          value = {
            gameName: fieldsValue.gameName,
            range: {
              maximum: fieldsValue.maximum,
              minimum: fieldsValue.minimum,
            },
            period: {
              startTime: fieldsValue.startTime,
              endTime: fieldsValue.endTime,
            }
          };
          Secondary.flowBonus = value;
          break;
        // 投注彩金  BetBonus 
        case 'BetBonus':
          value = {
            ...fieldsValue,
            range: {
              maximum: fieldsValue.maximum,
              minimum: fieldsValue.minimum,
            },
            period: {
              startTime: fieldsValue.startTime,
              endTime: fieldsValue.endTime,
            },
          };
          delete value.maximum;
          delete value.minimum;
          delete value.startTime;
          delete value.endTime;
          Secondary.betBonus = value;
          break;
        // 输赢彩金  WinBonus
        case 'WinBonus':
          value = {
            gameName: fieldsValue.gameName,
            range: {
              maximum: fieldsValue.maximum,
              minimum: fieldsValue.minimum,
            },
            period: {
              startTime: fieldsValue.startTime,
              endTime: fieldsValue.endTime,
            }
          };
          Secondary.winBonus = value;
          break;
        // 存款彩金  DepositBonus
        case 'DepositBonus':
          value = {
            containPromotion: fieldsValue.containPromotion,
            range: {
              maximum: fieldsValue.maximum,
              minimum: fieldsValue.minimum,
            },
            period: {
              startTime: fieldsValue.startTime,
              endTime: fieldsValue.endTime,
            }
          };
          Secondary.depositBonus = value;
          break;
        // 复存彩金  MultipleDepositBonus
        case 'MultipleDepositBonus':
          value = {
            times: fieldsValue.times,
            range: {
              maximum: fieldsValue.maximum,
              minimum: fieldsValue.minimum,
            },
            period: {
              startTime: fieldsValue.startTime,
              endTime: fieldsValue.endTime,
            }
          };
          Secondary.multipleDepositBonus = value;
          break;
        // 在线彩金  OnlineBonus
        case 'OnlineBonus':
          value = {
            days: fieldsValue.days,
            isContinuous: fieldsValue.isContinuous,
            period: {
              startTime: fieldsValue.startTime,
              endTime: fieldsValue.endTime,
            }
          };
          Secondary.onlineBonus = value;
          break;
        // VIP彩金  VipBonus
        case 'VipBonus':
          value = {
            range: {
              maximum: fieldsValue.maximum,
              minimum: fieldsValue.minimum,
            },
            period: {
              startTime: fieldsValue.startTime,
              endTime: fieldsValue.endTime,
            }
          };
          Secondary.vipBonus = value;
          break;
      }
      // console.log('value', value, Secondary);
      // form.resetFields();
      updataPromotionRule(Secondary);

    });
  };



  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, currentInfo = {} } = this.props;
    const { VisibleBetrothal = false, isContainPromotion = false } = this.state;
    // console.log('currentInfo',currentInfo)
    return (
      <Modal
        destroyOnClose
        title={`${currentInfo.displayName || ''}验证规则`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        maskClosable={false}
        width={650}
      >
        {/* 注册彩金  RegisterBonus  */}
        {
          currentInfo.code === 'RegisterBonus' ? (
            <Fragment>
              <FormItem {...formItemLayout} label="实名认证">
                {form.getFieldDecorator('userVerified', {
                  rules: [
                    {
                      required: false,
                      message: '是否实名认证',
                    },
                  ],
                  initialValue: editRoleDate.userVerified,
                })(
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            </Fragment>
          ) : null
        }

        {/* 首存金额  FirstDepositBonus  */}
        {
          currentInfo.code === 'FirstDepositBonus' ? (
            <Fragment>
              <FormItem {...formItemLayout} label="包含活动金">
                {form.getFieldDecorator('containPromotion', {
                  rules: [
                    {
                      required: false,
                      message: '是否包含活动金',
                    },
                  ],
                  initialValue: editRoleDate.containPromotion,
                })(
                  <Radio.Group onChange={(e) => this.setState({ isContainPromotion: e.target.value })}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>

              {/* {
                isContainPromotion ? (
                  <Fragment> */}
              <FormItem {...formItemLayout} label="活动金最大值">
                {form.getFieldDecorator('maximum', {
                  rules: [
                    {
                      required: false,
                      message: '请输入活动金最大值！',
                    },
                  ],
                  initialValue: editRoleDate.maximum,
                })(<InputNumber placeholder="请输入活动金最大值" style={{ width: "100%" }} />)}
              </FormItem>

              <FormItem {...formItemLayout} label="活动金最小值">
                {form.getFieldDecorator('minimum', {
                  rules: [
                    {
                      required: false,
                      message: '请输入活动金最小值！',
                    },
                  ],
                  initialValue: editRoleDate.minimum,
                })(<InputNumber placeholder="请输入活动金最小值" style={{ width: "100%" }} />)}
              </FormItem>
              {/* </Fragment>
                ) : null
              } */}


            </Fragment>
          ) : null
        }

        {/* 流水金额  FlowBonus  */}
        {/* 输赢彩金  WinBonus   这两个内容格式一样*/}
        {
          (currentInfo.code === 'FlowBonus' || currentInfo.code === 'WinBonus') ? (
            <Fragment>
              <FormItem {...formItemLayout} label="游戏名称">
                {form.getFieldDecorator('gameName', {
                  rules: [
                    {
                      required: false,
                      message: '请输入游戏名称！',
                    },
                  ],
                  initialValue: editRoleDate.gameName,
                })(<Input placeholder="请输入游戏名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="开始时间">
                {form.getFieldDecorator('startTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入开始时间！',
                    },
                  ],
                  initialValue: editRoleDate.startTime,
                })(<CustomDatePicker />)}
              </FormItem>
              <FormItem {...formItemLayout} label="结束时间">
                {form.getFieldDecorator('endTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入结束时间！',
                    },
                  ],
                  initialValue: editRoleDate.endTime,
                })(<CustomDatePicker />)}
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
                })(<InputNumber placeholder="请输入最大值" style={{ width: "100%" }} />)}
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
                })(<InputNumber placeholder="请输入最小值" style={{ width: "100%" }} />)}
              </FormItem>
            </Fragment>
          ) : null
        }

        {/* 投注彩金  BetBonus  */}
        {
          currentInfo.code === 'BetBonus' ? (
            <Fragment>
              <FormItem {...formItemLayout} label="游戏名称">
                {form.getFieldDecorator('gameName', {
                  rules: [
                    {
                      required: false,
                      message: '请输入游戏名称！',
                    },
                  ],
                  initialValue: editRoleDate.gameName,
                })(<Input placeholder="请输入游戏名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="开始时间">
                {form.getFieldDecorator('startTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入开始时间！',
                    },
                  ],
                  initialValue: editRoleDate.startTime,
                })(<CustomDatePicker />)}
              </FormItem>
              <FormItem {...formItemLayout} label="结束时间">
                {form.getFieldDecorator('endTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入结束时间！',
                    },
                  ],
                  initialValue: editRoleDate.endTime,
                })(<CustomDatePicker />)}
              </FormItem>

              <FormItem {...formItemLayout} label="是否连续记录">
                {form.getFieldDecorator('isContinuous', {
                  rules: [
                    {
                      required: false,
                      message: '是否连续记录',
                    },
                  ],
                  initialValue: editRoleDate.isContinuous,
                })(
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否全赢">
                {form.getFieldDecorator('isAllWin', {
                  rules: [
                    {
                      required: false,
                      message: '是否全赢',
                    },
                  ],
                  initialValue: editRoleDate.isAllWin,
                })(
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否全输">
                {form.getFieldDecorator('isAllLose', {
                  rules: [
                    {
                      required: false,
                      message: '是否全输',
                    },
                  ],
                  initialValue: editRoleDate.isAllLose,
                })(
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="单号包含">
                {form.getFieldDecorator('containString', {
                  rules: [
                    {
                      required: false,
                      message: '请输入单号包含！',
                    },
                  ],
                  initialValue: editRoleDate.containString,
                })(<Input placeholder="请输入单号包含" />)}
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
                })(<InputNumber placeholder="请输入最大值" style={{ width: "100%" }} />)}
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
                })(<InputNumber placeholder="请输入最小值" style={{ width: "100%" }} />)}
              </FormItem>
            </Fragment>
          ) : null
        }

        {/* 存款彩金  DepositBonus  */}
        {
          (currentInfo.code === 'DepositBonus') ? (
            <Fragment>
              <FormItem {...formItemLayout} label="包含活动金">
                {form.getFieldDecorator('containPromotion', {
                  rules: [
                    {
                      required: false,
                      message: '是否包含活动金',
                    },
                  ],
                  initialValue: editRoleDate.containPromotion,
                })(
                  <Radio.Group onChange={(e) => this.setState({ isContainPromotion: e.target.value })}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="开始时间">
                {form.getFieldDecorator('startTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入开始时间！',
                    },
                  ],
                  initialValue: editRoleDate.startTime,
                })(<CustomDatePicker />)}
              </FormItem>
              <FormItem {...formItemLayout} label="结束时间">
                {form.getFieldDecorator('endTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入结束时间！',
                    },
                  ],
                  initialValue: editRoleDate.endTime,
                })(<CustomDatePicker />)}
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
                })(<InputNumber placeholder="请输入最大值" style={{ width: "100%" }} />)}
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
                })(<InputNumber placeholder="请输入最小值" style={{ width: "100%" }} />)}
              </FormItem>
            </Fragment>
          ) : null
        }

        {/* 复存彩金  MultipleDepositBonus  */}
        {
          (currentInfo.code === 'MultipleDepositBonus') ? (
            <Fragment>
              <FormItem {...formItemLayout} label="复存次数">
                {form.getFieldDecorator('times', {
                  rules: [
                    {
                      required: false,
                      message: '请输入复存次数！',
                    },
                  ],
                  initialValue: editRoleDate.times,
                })(<InputNumber placeholder="请输入复存次数" style={{ width: "100%" }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="开始时间">
                {form.getFieldDecorator('startTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入开始时间！',
                    },
                  ],
                  initialValue: editRoleDate.startTime,
                })(<CustomDatePicker />)}
              </FormItem>
              <FormItem {...formItemLayout} label="结束时间">
                {form.getFieldDecorator('endTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入结束时间！',
                    },
                  ],
                  initialValue: editRoleDate.endTime,
                })(<CustomDatePicker />)}
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
                })(<InputNumber placeholder="请输入最大值" style={{ width: "100%" }} />)}
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
                })(<InputNumber placeholder="请输入最小值" style={{ width: "100%" }} />)}
              </FormItem>
            </Fragment>
          ) : null
        }

        {/* 在线彩金  OnlineBonus  */}
        {
          (currentInfo.code === 'OnlineBonus') ? (
            <Fragment>
              <FormItem {...formItemLayout} label="天数">
                {form.getFieldDecorator('days', {
                  rules: [
                    {
                      required: false,
                      message: '请输入天数！',
                    },
                  ],
                  initialValue: editRoleDate.days,
                })(<InputNumber placeholder="请输入天数" style={{ width: "100%" }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="是否连续">
                {form.getFieldDecorator('isContinuous', {
                  rules: [
                    {
                      required: false,
                      message: '请输入是否连续',
                    },
                  ],
                  initialValue: editRoleDate.isContinuous,
                })(
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="开始时间">
                {form.getFieldDecorator('startTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入开始时间！',
                    },
                  ],
                  initialValue: editRoleDate.startTime,
                })(<CustomDatePicker />)}
              </FormItem>
              <FormItem {...formItemLayout} label="结束时间">
                {form.getFieldDecorator('endTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入结束时间！',
                    },
                  ],
                  initialValue: editRoleDate.endTime,
                })(<CustomDatePicker />)}
              </FormItem>

            </Fragment>
          ) : null
        }

        {/* VIP彩金  VipBonus  */}
        {
          (currentInfo.code === 'VipBonus') ? (
            <Fragment>
              <FormItem {...formItemLayout} label="开始时间">
                {form.getFieldDecorator('startTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入开始时间！',
                    },
                  ],
                  initialValue: editRoleDate.startTime,
                })(<CustomDatePicker />)}
              </FormItem>
              <FormItem {...formItemLayout} label="结束时间">
                {form.getFieldDecorator('endTime', {
                  rules: [
                    {
                      required: false,
                      message: '请输入结束时间！',
                    },
                  ],
                  initialValue: editRoleDate.endTime,
                })(<CustomDatePicker />)}
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
                })(<InputNumber placeholder="请输入最大值" style={{ width: "100%" }} />)}
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
                })(<InputNumber placeholder="请输入最小值" style={{ width: "100%" }} />)}
              </FormItem>
            </Fragment>
          ) : null
        }





      </Modal>
    );
  }
}

export default Form.create()(RuleConfig);
