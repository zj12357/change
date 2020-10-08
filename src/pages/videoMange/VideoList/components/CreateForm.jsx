import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component } from 'react';
import UploadImg from '@/components/Upload/UploadImg.jsx';
import UploadVideo from '@/components/Upload/UploadVideo.jsx';
import { connect } from 'dva';
import { Col, Row } from 'antd';
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

@connect(({ VideoListModel, loading }) => ({
  VideoListModel,
  submitting: loading.effects['VideoListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //资讯类型列表
    modeList: [], //平台列表
    informationList: [], //资讯列表
    isEditName: '新增',
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

    // dispatch({
    //   type: 'matchListModel/fetch',
    //   payload: {
    //     pageIndex: 1,
    //     pageSize: 300,
    //   },
    //   callback: data => {
    //     let list = data.list || [];
    //     this.setState({ informationList: list });
    //   },
    // });

    dispatch({
      type: 'GetSYSPlatformListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        this.setState({ modeList: data.sysPlatformList || [] });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };

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
      VideoListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [], informationList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}视频`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={1100}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="标题">
              {form.getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题！',
                  },
                ],
                initialValue: editRoleDate.title,
              })(<Input placeholder="请输入标题" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="视频类型">
              {form.getFieldDecorator('videoTypeById', {
                rules: [
                  {
                    required: false,
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

          <Col span={8}>
            <FormItem {...formItemLayout} label="标签">
              {form.getFieldDecorator('label', {
                rules: [
                  {
                    required: false,
                    message: '请输入标签！',
                  },
                ],
                initialValue: editRoleDate.label,
              })(<Input placeholder="请输入标签(多个标签用英文,拆分 )" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="平台">
              {form.getFieldDecorator('platformById', {
                rules: [
                  {
                    required: false,
                    message: '请选择平台',
                  },
                ],
                initialValue: editRoleDate.platformById,
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
                      <Option value={item.pfId} key={item.pfId}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="播放量">
              {form.getFieldDecorator('browseNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入播放量！',
                  },
                ],
                initialValue: editRoleDate.browseNumber,
              })(<InputNumber placeholder="请输入播放量" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="评论量">
              {form.getFieldDecorator('commentNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入评论量！',
                  },
                ],
                initialValue: editRoleDate.commentNumber,
              })(<InputNumber placeholder="请输入评论量" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="分享量">
              {form.getFieldDecorator('shareNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入分享量！',
                  },
                ],
                initialValue: editRoleDate.shareNumber,
              })(<InputNumber placeholder="请输入分享量" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="内容">
              {form.getFieldDecorator('content', {
                rules: [
                  {
                    required: false,
                    message: '请输入内容！',
                  },
                ],
                initialValue: editRoleDate.content,
              })(<Input placeholder="请输入内容！" />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="评论功能">
              {form.getFieldDecorator('commentStatus', {
                rules: [
                  {
                    required: false,
                    message: '请选择！',
                  },
                ],
                initialValue: editRoleDate.commentStatus,
              })(
                <Radio.Group>
                  <Radio value={1}>开启</Radio>
                  <Radio value={0}>关闭</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
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
          <Col span={8}>
            <FormItem {...formItemLayout} label="是否可看">
              {form.getFieldDecorator('status', {
                rules: [
                  {
                    required: false,
                    message: '请选择！',
                  },
                ],
                initialValue: editRoleDate.status,
              })(
                <Radio.Group>
                  <Radio value={1}>开启</Radio>
                  <Radio value={0}>关闭</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
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
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="概要">
              {form.getFieldDecorator('summary', {
                rules: [
                  {
                    required: false,
                    message: '请输入概要！',
                  },
                ],
                initialValue: editRoleDate.summary,
              })(<Input.TextArea rows={4} placeholder="请输入概要" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="视频">
              {form.getFieldDecorator('videoURL', {
                rules: [
                  {
                    required: false,
                    message: '请输入视频！',
                  },
                ],
                initialValue: editRoleDate.videoURL,
              })(<UploadVideo />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="缩略图">
              {form.getFieldDecorator('imgAddress', {
                rules: [
                  {
                    required: false,
                    message: '请输入缩略图！',
                  },
                ],
                initialValue: editRoleDate.imgAddress,
              })(<UploadImg />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
