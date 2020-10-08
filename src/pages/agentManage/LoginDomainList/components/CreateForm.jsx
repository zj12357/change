import { Form, Input, Modal, Select, InputNumber } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'antd';
import loadsh from 'lodash';
import { connect } from 'dva';

import { keysID } from './../keys.js';

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

@connect(({ LoginDomainListModel, loading }) => ({
  LoginDomainListModel,
  submitting: loading.effects['LoginDomainListModel/add'],
}))
class CreateForm extends Component {
  state = {
    isEditName: '新增',
    userList: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
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
  fetchUserList = val => {
    this.debounceFun(val);
  };
  //搜索防抖
  debounceFun = loadsh.debounce(function(val) {
    this.getUserList(val);
  }, 700);
  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...fieldsValue, [keysID]: editRoleDate[keysID] };

      handleAdd(value);
    });
  };

  render() {
    const { modalVisible, form, handleModalVisible, editRoleDate = {}, submitting } = this.props;
    const { isEditName, userList } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}号码分配`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={950}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="主题">
              {form.getFieldDecorator('applyTitle', {
                rules: [
                  {
                    required: true,
                    message: '请输入主题',
                  },
                ],
                initialValue: editRoleDate.applyTitle,
              })(<Input placeholder="请输入主题" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="申请者">
              {form.getFieldDecorator('applyUserID', {
                rules: [
                  {
                    required: true,
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
              {form.getFieldDecorator('applyCount', {
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
            <FormItem {...formItemLayout} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '请输入备注',
                  },
                ],
                initialValue: editRoleDate.remark,
              })(<Input placeholder="请输入备注" />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
