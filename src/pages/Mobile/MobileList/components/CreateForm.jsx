import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import React, { Component } from 'react';
import { Col, Row } from 'antd';

import { connect } from 'dva';

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

@connect(({ MobileListModel, loading }) => ({
  MobileListModel,
  submitting: loading.effects['MobileListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //模块配置列表
    modeList: [],
    isEditName: '新增',
    lotMobileList: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'SourceListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        this.setState({ sysMenuList: data.list || [] });
      },
    });

    dispatch({
      type: 'MobileListModel/getLotMobile',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        this.setState({ lotMobileList: data.list || [] });
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

  getChildren = data => {
    return data.map(item => {
      return {
        title: item.name,
        key: item.id,
        value: item.id,
        children:
          item.children == null || item.children.length <= 0 ? [] : this.getChildren(item.children),
      };
    });
  };
  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      MobileListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], lotMobileList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}号码库`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={950}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="渠道来源">
              {form.getFieldDecorator('cid', {
                rules: [
                  {
                    required: true,
                    message: '请选择数据渠道',
                  },
                ],
                initialValue: editRoleDate.cid,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  placeholder="请选择数据渠道"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                  treeData={this.getChildren(sysMenuList)}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                ></TreeSelect>,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="批次">
              {form.getFieldDecorator('batchNo', {
                rules: [
                  {
                    required: true,
                    message: '请选择批次',
                  },
                ],
                initialValue: editRoleDate.batchNo,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择批次"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {lotMobileList.map((item, index) => (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="手机号码">
              {form.getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号码',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误',
                  },
                ],
                initialValue: editRoleDate.mobile,
              })(<Input placeholder="请输入手机号码" />)}
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
