import { Form, Input, InputNumber, Modal, Radio, Select, Cascader, Spin } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'antd';
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

@connect(({ PredictionRecordListModel, loading }) => ({
  PredictionRecordListModel,
  submitting: loading.effects['PredictionRecordListModel/add'],
  searchUserLoading: loading.effects['matchListModel/fetch'],
  searchUniosLoading: loading.effects['unionListModel/fetch'],
  searchTeamLoading: loading.effects['teamListModel/fetch'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 赛事列表
    unionList: [], //联赛列表
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
      type: 'matchListModel/fetch',
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

  getSerachUnionList = name => {
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
        this.setState({ unionList: data.list || [] });
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

      // console.log('fieldsValue', value)
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
      PredictionRecordListModel: { data },
      submitting,
      searchUserLoading,
      searchUniosLoading,
      searchTeamLoading,
    } = this.props;
    const { isEditName, sysMenuList = [], unionList = [], teamList = [] } = this.state;
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
          <Col span={12}>
            <FormItem {...formItemLayout} label="联赛名称">
              {form.getFieldDecorator('leagueByName', {
                rules: [
                  {
                    required: false,
                    message: '请输入联赛名称！',
                  },
                ],
                initialValue: editRoleDate.leagueByName,
              })(<Input placeholder="请输入联赛名称" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="联赛编号">
              {form.getFieldDecorator('leagueById', {
                rules: [
                  {
                    required: false,
                    message: '请输入联赛编号！',
                  },
                ],
                initialValue: editRoleDate.leagueById,
              })(
                <Select
                  style={{ width: '100%' }}
                  notFoundContent={searchUniosLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  onSearch={debounce(this.getSerachUnionList, 1000)}
                  placeholder="请输入联赛名称搜索联赛"
                  loading={searchUniosLoading}
                  defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {unionList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="赛事编号">
              {form.getFieldDecorator('competitionById', {
                rules: [
                  {
                    required: true,
                    message: '请输入赛事编号！',
                  },
                ],
                initialValue: editRoleDate.competitionById,
              })(
                <Select
                  style={{ width: '100%' }}
                  notFoundContent={searchUserLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  onSearch={debounce(this.getSerachUser, 1000)}
                  placeholder="请输入赛事名称搜索赛事"
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
          <Col span={12}>
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
          <Col span={12}>
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
          {/* <Col span={12}>
            <FormItem {...formItemLayout} label="主队名称">
              {form.getFieldDecorator('homeTeamName', {
                rules: [
                  {
                    required: false,
                    message: '请输入主队名称！',
                  },
                ],
                initialValue: editRoleDate.homeTeamName,
              })(<Input placeholder="请输入主队名称" />)}
            </FormItem>
          </Col> */}
          {/* <Col span={12}>
            <FormItem {...formItemLayout} label="客队名称">
              {form.getFieldDecorator('visitingTeamName', {
                rules: [
                  {
                    required: false,
                    message: '请输入客队名称！',
                  },
                ],
                initialValue: editRoleDate.visitingTeamName,
              })(<Input placeholder="请输入客队名称" />)}
            </FormItem>
          </Col> */}
          <Col span={12}>
            <FormItem {...formItemLayout} label="推荐">
              {form.getFieldDecorator('tips', {
                rules: [
                  {
                    required: false,
                    message: '请输入推荐！',
                  },
                ],
                initialValue: editRoleDate.tips,
              })(<Input placeholder="示例:格式：1或X或2 (1为 主胜 X 平局 2 客胜)" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="结果预测">
              {form.getFieldDecorator('outcome', {
                rules: [
                  {
                    required: false,
                    message: '请输入结果预测！',
                  },
                ],
                initialValue: editRoleDate.outcome,
              })(<Input placeholder="示例:格式：63%;21%;16% ,（主胜；平局 ；客胜） " />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="平均赔率">
              {form.getFieldDecorator('averageOdds', {
                rules: [
                  {
                    required: false,
                    message: '请输入平均赔率！',
                  },
                ],
                initialValue: editRoleDate.averageOdds,
              })(<Input placeholder="示例:格式：2.25;3.35;2.85, (主胜；平局 ；客胜)" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="预测结果">
              {form.getFieldDecorator('predictionStatus', {
                rules: [
                  {
                    required: false,
                    message: '请选择预测结果！',
                  },
                ],
                initialValue: editRoleDate.predictionStatus,
              })(
                <Radio.Group>
                  <Radio value={1}>命中</Radio>
                  <Radio value={0}>未中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
        </Row>

        {/* <Col span={12}>
            <FormItem {...formItemLayout} label="准确率">
              {form.getFieldDecorator('accuracy', {
                rules: [
                  {
                    required: false,
                    message: '请输入准确率！',
                  },
                  {
                    pattern: /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/,
                    message: '请输入小数(0-100，不超过小数点后两位)',
                  },
                ],
                initialValue: editRoleDate.accuracy,
              })(<InputNumber placeholder="请输入准确率" style={{ width: '100%' }} />)}
            </FormItem>
          </Col> */}
        {/* <FormItem {...formItemLayout} label="创建时间">
          {form.getFieldDecorator('createTime', {
            rules: [
              {
                required: false,
                message: '请输入创建时间！',
              },
            ],
            initialValue: editRoleDate.createTime,
          })(<CustomDatePicker />)}
        </FormItem> */}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
