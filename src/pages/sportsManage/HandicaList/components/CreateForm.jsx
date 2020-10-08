import { Form, Input, InputNumber, Modal, Radio, Select, Spin } from 'antd';
import React, { Component } from 'react';

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

@connect(({ HandicaListModel, loading }) => ({
  HandicaListModel,
  submitting: loading.effects['HandicaListModel/add'],
  searchUserLoading: loading.effects['matchListModel/fetch'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 盘口信息列表
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
      HandicaListModel: { data },
      submitting,
      searchUserLoading,
    } = this.props;
    const { isEditName, sysMenuList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}盘口信息`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >
        <FormItem {...formItemLayout} label="盘口名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入盘口名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入盘口名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="注单内容">
          {form.getFieldDecorator('betContent', {
            rules: [
              {
                required: false,
                message: '请输入注单内容！',
              },
            ],
            initialValue: editRoleDate.betContent,
          })(<Input placeholder="请输入注单内容" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="赛事编号">
          {form.getFieldDecorator('competitionById', {
            rules: [
              {
                required: false,
                message: '请输入赛事编号！',
              },
            ],
            initialValue: editRoleDate.competitionById,
          })(
            <Select
              style={{ width: '100%' }}
              showSearch
              showArrow={false} // 是否显示下拉小箭头
              notFoundContent={searchUserLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={debounce(this.getSerachUser, 1000)}
              placeholder="请输入赛事名称搜索赛事"
              loading={searchUserLoading}
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
        <FormItem {...formItemLayout} label="是否实时">
          {form.getFieldDecorator('isReal', {
            rules: [
              {
                required: true,
                message: '请选择是否实时！',
              },
            ],
            initialValue: editRoleDate.isReal,
          })(
            <Radio.Group>
              <Radio value={true}>实时</Radio>
              <Radio value={false}>初盘</Radio>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="亚盘">
          {form.getFieldDecorator('asia', {
            rules: [
              {
                required: false,
                message: '请输入亚盘！',
              },
            ],
            initialValue: editRoleDate.asia,
          })(<Input placeholder="请输入亚盘(例：1-2;1.5-2.0;1.0-1.5)" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="欧盘">
          {form.getFieldDecorator('europe', {
            rules: [
              {
                required: false,
                message: '请输入欧盘！',
              },
            ],
            initialValue: editRoleDate.europe,
          })(<Input placeholder="请输入欧盘(例：1-2;1.5-2.0;1.0-1.5)" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="大小盘">
          {form.getFieldDecorator('size', {
            rules: [
              {
                required: false,
                message: '请输入大小盘！',
              },
            ],
            initialValue: editRoleDate.size,
          })(<Input placeholder="请输入大小盘(例：1-2;1.5-2.0;1.0-1.5)" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="结果预测">
          {form.getFieldDecorator('outcome', {
            rules: [
              {
                required: false,
                message: '请输入结果预测！',
              },
            ],
            initialValue: editRoleDate.outcome,
          })(<Input placeholder="请输入结果预测(例：63%;21%;16%)" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
