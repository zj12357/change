import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'antd';

import { connect } from 'dva';
import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';
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

@connect(({ VideoCommentListModel, loading }) => ({
  VideoCommentListModel,
  submitting: loading.effects['VideoCommentListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //视频类型列表
    modeList: [], //视频列表
    informationList: [], //评论列表
    isEditName: '新增',
    cmUserInfoList: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'VideoTypeListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        this.setState({ sysMenuList: data.list || [] });
      },
    });

    dispatch({
      type: 'VideoCommentListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        let list = data.list || [];
        const id = editRoleDate.id || '';
        list = list.filter(item => item.id !== id);
        this.setState({ informationList: list });
      },
    });

    dispatch({
      type: 'VideoListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        this.setState({ modeList: data.list || [] });
      },
    });

    dispatch({
      type: 'UserInfoListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        let list = data.cmUserInfoList || [];
        this.setState({ cmUserInfoList: list });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };

      if (value.isShow === null) {
        delete value.isShow;
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
      editRoleDate = {},
      VideoCommentListModel: { data },
      submitting,
    } = this.props;
    const {
      isEditName,
      sysMenuList = [],
      modeList = [],
      informationList = [],
      cmUserInfoList = [],
    } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}视频评论`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={950}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="视频类型">
              {form.getFieldDecorator('videoTypeById', {
                rules: [
                  {
                    required: true,
                    message: '请选择视频类型！',
                  },
                ],
                initialValue: editRoleDate.videoTypeById,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择视频类型"
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
            <FormItem {...formItemLayout} label="父级评论">
              {form.getFieldDecorator('parentById', {
                rules: [
                  {
                    required: false,
                    message: '请选择父级评论！',
                  },
                ],
                initialValue: editRoleDate.parentById,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {informationList.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.content}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="视频">
              {form.getFieldDecorator('videoById', {
                rules: [
                  {
                    required: true,
                    message: '请选择视频',
                  },
                ],
                initialValue: editRoleDate.videoById,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {modeList.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.title}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="评论内容">
              {form.getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请输入评论内容！',
                  },
                ],
                initialValue: editRoleDate.content,
              })(<Input placeholder="请输入评论内容" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="是否推荐">
              {form.getFieldDecorator('isReferrals', {
                rules: [
                  {
                    required: false,
                    message: '请选择！',
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
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="排序">
              {form.getFieldDecorator('sort', {
                rules: [
                  {
                    required: false,
                    message: '请输入排序！',
                  },
                ],
                initialValue: editRoleDate.sort,
              })(<InputNumber placeholder="请输入排序" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="点赞量">
              {form.getFieldDecorator('endorseNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入点赞量！',
                  },
                ],
                initialValue: editRoleDate.endorseNumber,
              })(<InputNumber placeholder="请输入点赞量" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="点踩量">
              {form.getFieldDecorator('opposeNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入点踩量！',
                  },
                ],
                initialValue: editRoleDate.opposeNumber,
              })(<InputNumber placeholder="请输入点踩量" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="评论时间">
              {form.getFieldDecorator('createTime', {
                rules: [
                  {
                    required: false,
                    message: '请输入评论时间！',
                  },
                ],
                initialValue: editRoleDate.birthday,
              })(<CustomDatePicker />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="是否显示">
              {form.getFieldDecorator('isShow', {
                rules: [
                  {
                    required: false,
                    message: '请选择！',
                  },
                ],
                initialValue: editRoleDate.isShow,
              })(
                <Radio.Group>
                  <Radio value={true}>显示</Radio>
                  <Radio value={false}>不显示</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="评论人">
              {form.getFieldDecorator('userById', {
                rules: [
                  {
                    required: false,
                    message: '请选择评论人！',
                  },
                ],
                initialValue: editRoleDate.userById,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {cmUserInfoList.map(item => {
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
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
