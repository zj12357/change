import { Form, Input, InputNumber, Modal, Radio, Select, Spin } from 'antd';
import React, { Component, Fragment } from 'react';

import { connect } from 'dva';

import debounce from 'lodash/debounce';
import { keysID, listId } from '../keys.js';

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
// type:'SendPush',
// SendPush 指定用户，
// AllSendPush  所有用户
// RunSportPush  推送比赛消息
// RunLotterPush 彩票结果推送
const typeName = {
  SendPush: '推送指定用户消息',
  AllSendPush: '推送所有用户消息',
  RunSportPush: '推送比赛消息',
  RunLotterPush: '彩票结果推送',
};

@connect(({ PushRecordListModel, loading }) => ({
  PushRecordListModel,
  submitting: loading.effects['PushRecordListModel/add'],
  searchLoading: loading.effects['matchListModel/fetch'],
  searchUserLoading: loading.effects['UserInfoListModel/fetch'],
  searchLoadingLottery: loading.effects['LotteryCategoryListModel/fetch'],
}))
class CreateForm extends Component {
  state = {
    machList: [], // 比赛列表
    lotteryCategoryList: [], // 彩票列表
    cmUserInfoList: [], // 用户列表
    isEditName: '新增',
  };

  componentDidMount() {
    const { dispatch, editRoleDate = {}, type } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }

    // switch (type) {
    //   case 'SendPush':
    //     // this.getSerachUser()
    //     break;
    //   case 'RunLotterPush':
    //     this.getSerachMach();
    //     break;
    // }
  }

  // 远程搜索赛事列表
  getSerachMach = name => {
    if (!name) return;
    const { dispatch, editRoleDate = {}, type } = this.props;
    dispatch({
      type: 'matchListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ machList: data.list || [] });
      },
    });
  };

  // 搜索彩种
  getSerachLottery = name => {
    if (!name) return;
    const { dispatch, editRoleDate = {}, type } = this.props;
    dispatch({
      type: 'LotteryCategoryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ lotteryCategoryList: data.lotteryCategoryList || [] });
      },
    });
  };

  // 搜索用户
  getSerachUser = name => {
    if (!name) return;
    const { dispatch, editRoleDate = {}, type } = this.props;
    dispatch({
      type: 'UserInfoListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ cmUserInfoList: data.cmUserInfoList || [] });
      },
    });
  };

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {}, type } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = { ...fieldsValue, type };

      if (type === 'RunSportPush' && value.status) {
        value.status = Number(value.status);
      }

      //  toUser  接收ID -1：推送所有用户 否则当个用户ID
      if (type === 'AllSendPush') {
        value.toUser = '-1';
      }

      if (type === 'SendPush') {
        value.toUser = String(value.toUser);
      }

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
      type,
      editRoleDate = {},
      PushRecordListModel: { data },
      submitting,
      searchLoading,
      searchUserLoading,
      searchLoadingLottery,
    } = this.props;
    const {
      isEditName,
      sysMenuList = [],
      cmUserInfoList = [],
      machList = [],
      lotteryCategoryList = [],
    } = this.state;
    return (
      <Modal
        destroyOnClose
        title={typeName[type]}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        {/* //type:'SendPush',
        //SendPush 指定用户，
        // AllSendPush  所有用户
        // RunSportPush  推送比赛消息
        // RunLotterPush 彩票结果推送  */}
        {type === 'SendPush' || type === 'AllSendPush' ? (
          <Fragment>
            <FormItem {...formItemLayout} label="内容">
              {form.getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请输入内容！',
                  },
                ],
                // initialValue: editRoleDate.content,
              })(<Input placeholder="请输入内容" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="标题">
              {form.getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题！',
                  },
                ],
                // initialValue: editRoleDate.title,
              })(<Input placeholder="请输入标题" />)}
            </FormItem>
          </Fragment>
        ) : null}

        {type === 'SendPush' ? (
          <FormItem {...formItemLayout} label="选择用户">
            {form.getFieldDecorator('toUser', {
              rules: [
                {
                  required: true,
                  message: '请选择用户！',
                },
              ],
              // initialValue: [],
            })(
              <Select
                // mode="multiple"
                showSearch
                notFoundContent={searchUserLoading ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={debounce(this.getSerachUser, 1000)}
                style={{ width: '100%' }}
                placeholder="请输入用户名称搜索用户"
                loading={searchUserLoading}
                getPopupContainer={triggerNode => {
                  return triggerNode.parentNode || document.body;
                }}
              >
                {cmUserInfoList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
        ) : null}

        {type === 'RunSportPush' ? (
          <Fragment>
            <FormItem {...formItemLayout} label="选择比赛">
              {form.getFieldDecorator('competitionId', {
                rules: [
                  {
                    required: true,
                    message: '请选择！',
                  },
                ],
              })(
                <Select
                  showSearch // 使单选模式可搜索
                  defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
                  showArrow={false} // 是否显示下拉小箭头
                  notFoundContent={searchLoading ? <Spin size="small" /> : null} // 当下拉列表为空时显示的内容
                  filterOption={false} // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
                  onSearch={debounce(this.getSerachMach, 1000)}
                  style={{ width: '100%' }}
                  placeholder="请输入赛事名称搜索比赛"
                  loading={searchLoading}
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {machList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="比分">
              {form.getFieldDecorator('score', {
                rules: [
                  {
                    required: true,
                    message: '请输入比分！',
                  },
                ],
              })(<Input placeholder="请输入比分" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="比赛状态">
              {form.getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: '请选择！',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择！"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  <Option value="1">开始比赛</Option>
                  <Option value="2">上半场结束</Option>
                  <Option value="3">比分更新，进球了</Option>
                  <Option value="4">比赛结束</Option>
                </Select>,
              )}
            </FormItem>
          </Fragment>
        ) : null}
        {type === 'RunLotterPush' ? (
          <Fragment>
            <FormItem {...formItemLayout} label="彩票期号">
              {form.getFieldDecorator('number', {
                rules: [
                  {
                    required: true,
                    message: '请输入彩票期号！',
                  },
                ],
              })(<Input placeholder="请输入彩票期号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="彩种编号">
              {form.getFieldDecorator('lotteryCategoryById', {
                rules: [
                  {
                    required: true,
                    message: '请选择彩种编号！',
                  },
                ],
                initialValue: [],
              })(
                <Select
                  showSearch // 使单选模式可搜索
                  defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
                  showArrow={false} // 是否显示下拉小箭头
                  notFoundContent={searchLoadingLottery ? <Spin size="small" /> : null} // 当下拉列表为空时显示的内容
                  filterOption={false} // 是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false。
                  onSearch={debounce(this.getSerachLottery, 1000)}
                  style={{ width: '100%' }}
                  placeholder="请输入彩种名称搜索彩种"
                  loading={searchLoadingLottery}
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {lotteryCategoryList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="开奖结果">
              {form.getFieldDecorator('openNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入开奖结果！',
                  },
                ],
              })(<Input placeholder="请输入开奖结果" />)}
            </FormItem>
          </Fragment>
        ) : null}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
