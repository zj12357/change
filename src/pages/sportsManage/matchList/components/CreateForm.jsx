import { Form, Input, InputNumber, Modal, Radio, Select, Col, Row, Spin } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';
import debounce from 'lodash/debounce';
import { keysID, listId } from '../keys.js';

const FormItem = Form.Item;

const { Option } = Select;

function analysisJson(str) {
  if (!str) return str;
  const type = Object.prototype.toString.call(str);
  if (type === '[object Object]' || type === '[object Array]') {
    return JSON.stringify(str);
  }
  let objs = {};
  try {
    objs = JSON.parse(str);
  } catch (error) {
    console.log('解析json失败', error, str);
  }
  return objs;
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ matchListModel, loading }) => ({
  matchListModel,
  submitting: loading.effects['matchListModel/add'],
  searchUserLoading: loading.effects['unionListModel/fetch'],
  searchTeamLoading: loading.effects['teamListModel/fetch'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 赛事列表
    teamList: [], //球队列表
    isEditName: '新增',
  };

  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
  }

  getSerachUser = name => {
    if (!name) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'unionListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ sysMenuList: data.list || [] });
      },
    });
  };

  getSerachTeamList = name => {
    if (!name) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'teamListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ teamList: data.list || [] });
      },
    });
  };

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = { ...editRoleDate, ...fieldsValue };

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
      matchListModel: { data },
      submitting,
      searchUserLoading,
      searchTeamLoading,
    } = this.props;
    const { isEditName, sysMenuList = [], teamList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}赛事`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={1100}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="赛事名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入赛事名称！',
                  },
                ],
                initialValue: editRoleDate.name,
              })(<Input placeholder="请输入赛事名称" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="赛事状态">
              {form.getFieldDecorator('gameOver', {
                rules: [
                  {
                    required: false,
                    message: '请选择赛事状态！',
                  },
                ],
                initialValue: editRoleDate.gameOver,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择赛事状态！"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  <Option value={0}>未开赛</Option>
                  <Option value={1}>开赛</Option>
                  <Option value={2}>半场结束</Option>
                  <Option value={3}>下半场开始 </Option>
                  <Option value={4}>比赛结束 </Option>
                  <Option value={5}>推迟</Option>
                  <Option value={6}>待定</Option>
                  <Option value={7}>加时</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="赛季">
              {form.getFieldDecorator('season', {
                rules: [
                  {
                    required: false,
                    message: '请输入赛季！',
                  },
                ],
                initialValue: editRoleDate.season,
              })(<Input placeholder="请输入赛季(例:2020-2021)" />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="比赛日期">
              {form.getFieldDecorator('gameDate', {
                rules: [
                  {
                    required: false,
                    message: '请输入比赛日期！',
                  },
                ],
                initialValue: editRoleDate.gameDate,
              })(<CustomDatePicker />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="所属联赛">
              {form.getFieldDecorator('leagueById', {
                rules: [
                  {
                    required: false,
                    message: '请输入所属联赛！',
                  },
                ],
                initialValue: editRoleDate.leagueById,
              })(
                <Select
                  style={{ width: '100%' }}
                  notFoundContent={searchUserLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  onSearch={debounce(this.getSerachUser, 1000)}
                  placeholder="请输入联赛名称搜索联赛"
                  loading={searchUserLoading}
                  defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {sysMenuList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="主队编号">
              {form.getFieldDecorator('homeTeam', {
                rules: [
                  {
                    required: false,
                    message: '请输入主队编号！',
                  },
                ],
                initialValue: editRoleDate.homeTeam,
              })(
                <Select
                  style={{ width: '100%' }}
                  notFoundContent={searchTeamLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  onSearch={debounce(this.getSerachTeamList, 1000)}
                  placeholder="请输入球队名称搜索球队"
                  loading={searchTeamLoading}
                  defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {teamList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="客队编号">
              {form.getFieldDecorator('visitingTeam', {
                rules: [
                  {
                    required: false,
                    message: '请输入客队编号！',
                  },
                ],
                initialValue: editRoleDate.visitingTeam,
              })(
                <Select
                  style={{ width: '100%' }}
                  notFoundContent={searchTeamLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  onSearch={debounce(this.getSerachTeamList, 1000)}
                  placeholder="请输入球队名称搜索球队"
                  loading={searchTeamLoading}
                  defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {teamList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="黄牌">
              {form.getFieldDecorator('yellowCard', {
                rules: [
                  {
                    required: false,
                    message: '请输入黄牌！',
                  },
                ],
                initialValue: editRoleDate.yellowCard,
              })(<Input placeholder="请输入黄牌!(例:0-0 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="红牌">
              {form.getFieldDecorator('redCard', {
                rules: [
                  {
                    required: false,
                    message: '请输入红牌！',
                  },
                ],
                initialValue: editRoleDate.redCard,
              })(<Input placeholder="请输入红牌!(例:0-0 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="射正门数">
              {form.getFieldDecorator('shotsGoal', {
                rules: [
                  {
                    required: false,
                    message: '请输入射正门数！',
                  },
                ],
                initialValue: editRoleDate.shotsGoal,
              })(<Input placeholder="请输入射正门数!(例:1-2 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="射偏门数">
              {form.getFieldDecorator('asideGoal', {
                rules: [
                  {
                    required: false,
                    message: '请输入射偏门数！',
                  },
                ],
                initialValue: editRoleDate.asideGoal,
              })(<Input placeholder="请输入射偏门数!(例:1-2 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="点球">
              {form.getFieldDecorator('penaltyKick', {
                rules: [
                  {
                    required: false,
                    message: '请输入点球！',
                  },
                ],
                initialValue: editRoleDate.penaltyKick,
              })(<Input placeholder="请输入点球!(例:1-2 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="进攻">
              {form.getFieldDecorator('offensive', {
                rules: [
                  {
                    required: false,
                    message: '请输入进攻！',
                  },
                ],
                initialValue: editRoleDate.offensive,
              })(<Input placeholder="请输入进攻!(例:1-2 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="危险进攻">
              {form.getFieldDecorator('scathingOffensive', {
                rules: [
                  {
                    required: false,
                    message: '请输入危险进攻！',
                  },
                ],
                initialValue: editRoleDate.scathingOffensive,
              })(<Input placeholder="请输入危险进攻!(例:1-2 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="控球率">
              {form.getFieldDecorator('possession', {
                rules: [
                  {
                    required: false,
                    message: '请输入控球率！',
                  },
                ],
                initialValue: editRoleDate.possession,
              })(<Input placeholder="请输入控球率!(例:40-32 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="中场比分">
              {form.getFieldDecorator('midfielderScore', {
                rules: [
                  {
                    required: false,
                    message: '请输入中场比分！',
                  },
                ],
                initialValue: editRoleDate.midfielderScore,
              })(<Input placeholder="请输入中场比分" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="角球">
              {form.getFieldDecorator('cornerKick', {
                rules: [
                  {
                    required: false,
                    message: '请输入角球！',
                  },
                ],
                initialValue: editRoleDate.cornerKick,
              })(<Input placeholder="请输入角球!(例:0-0 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="实时比分">
              {form.getFieldDecorator('score', {
                rules: [
                  {
                    required: false,
                    message: '请输入实时比分！',
                  },
                ],
                initialValue: editRoleDate.score,
              })(<Input placeholder="请输入实时比分!(例:0-0 )" />)}
            </FormItem>
          </Col>

          <Col span={8}>
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
                  <Radio value>推荐</Radio>
                  <Radio value={false}>不推荐</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="人气">
              {form.getFieldDecorator('popularity', {
                rules: [
                  {
                    required: false,
                    message: '请输入人气！',
                  },
                ],
                initialValue: editRoleDate.popularity,
              })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="聊天室编号">
              {form.getFieldDecorator('chatRoom', {
                rules: [
                  {
                    required: false,
                    message: '请输入聊天室编号！',
                  },
                ],
                initialValue: editRoleDate.chatRoom,
              })(<Input placeholder="请输入聊天室编号" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '请输入备注！',
                  },
                ],
                initialValue: editRoleDate.remark,
              })(<Input.TextArea placeholder="请输入备注" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="直播方式">
              {form.getFieldDecorator('liveMethod', {
                rules: [
                  {
                    required: false,
                    message: '请输入直播方式！',
                  },
                ],
                initialValue: editRoleDate.liveMethod ? analysisJson(editRoleDate.liveMethod) : '',
              })(<Input.TextArea placeholder="请输入直播方式(json字符串)" />)}
            </FormItem>
          </Col>
        </Row>

        {/* <FormItem {...formItemLayout} label="预测状态">
          {form.getFieldDecorator('predictionStatus', {
            rules: [
              {
                required: false,
                message: '请输入预测状态！',
              },
            ],
            initialValue: editRoleDate.predictionStatus,
          })(<Input placeholder="请输入预测状态" />)}
        </FormItem>

         <FormItem {...formItemLayout} label="推送状态">
          {form.getFieldDecorator('pushStatus', {
            rules: [
              {
                required: false,
                message: '请输入推送状态！',
              },
            ],
            initialValue: editRoleDate.pushStatus,
          })(<Input placeholder="请输入推送状态" />)}
        </FormItem> */}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
