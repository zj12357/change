import { Icon, Modal, Row, Col, Switch, Form, Select, Input, InputNumber, message } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

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

@connect(({ DistributionListModel, loading }) => ({
  DistributionListModel,
}))
class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }

  componentWillMount() {
    this.getUserList();
  }

  getUserList = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userMangeModel/fetch',
      payload: {
        userName: val,
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const list = data.sysUserList || [];
        this.setState({ userList: list });
      },
    });
  };

  okHandle = () => {
    const { form, handleModalVisibleUpload, dispatch, editRoleDate, getReloadList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { confirmUserID, ...rest } = fieldsValue;
      dispatch({
        type: 'DistributionListModel/confirmApply',
        payload: {
          id: editRoleDate.id,
          ...rest,
        },
        callback: () => {
          message.success('审核成功');
          handleModalVisibleUpload();
          getReloadList();
        },
      });
    });
  };

  render() {
    const { modalVisible, handleModalVisibleUpload, form, editRoleDate = {} } = this.props;
    const { userList } = this.state;
    return (
      <Modal
        width={950}
        destroyOnClose
        title="审核"
        visible={modalVisible}
        onCancel={handleModalVisibleUpload}
        onOk={this.okHandle}
        maskClosable={false}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="申请人">
              {form.getFieldDecorator('confirmUserID', {
                rules: [
                  {
                    required: false,
                    message: '请输入申请者',
                  },
                ],
                initialValue: editRoleDate.applyUserID,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择用户"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                  onSearch={this.fetchUserList}
                  showSearch
                  disabled
                >
                  {userList.map((item, index) => {
                    return (
                      <Option value={item.userID} key={index}>
                        {item.userName}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="申请数量">
              <InputNumber value={editRoleDate.applyCount} style={{ width: '100%' }} disabled />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="实际申请数量">
              {form.getFieldDecorator('confirmCount', {
                rules: [
                  {
                    required: true,
                    message: '请输入申请数量',
                  },
                ],
                initialValue: editRoleDate.applyCount,
              })(<InputNumber placeholder="请输入申请数量" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="申请状态">
              {form.getFieldDecorator('applyState', {
                rules: [
                  {
                    required: true,
                    message: '请选择申请状态',
                  },
                ],
                initialValue: 'Confirm',
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  <Option value={'Back'}>回退</Option>
                  <Option value={'Confirm'}>通过</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="备注">
              {form.getFieldDecorator('checkRemark', {
                rules: [
                  {
                    required: false,
                    message: '请输入备注',
                  },
                ],
                initialValue: editRoleDate.checkRemark,
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
