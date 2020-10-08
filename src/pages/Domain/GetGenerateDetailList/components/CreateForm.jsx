import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

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

@connect(({ GetGenerateDetailListModel, loading }) => ({
  GetGenerateDetailListModel,
  submitting: loading.effects['GetGenerateDetailListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //模块配置列表
    modeList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'GenerationListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const list = data.generationParamList || [];
        this.setState({ modeList: list });
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
      GetGenerateDetailListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}短链接生成明细`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="短链接">
          {form.getFieldDecorator('gid', {
            rules: [
              {
                required: true,
                message: '请选择短链接！',
              },
            ],
            initialValue: editRoleDate.gid,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择短链接！"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {modeList.map(item => (
                <Option value={item.gid} key={item.gid}>
                  {item.name || item.domain}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="短链接URL">
          {form.getFieldDecorator('url', {
            rules: [
              {
                required: true,
                message: '请输入短链接URL！',
              },
            ],
            initialValue: editRoleDate.url,
          })(<Input placeholder="请输入短链接URL" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
