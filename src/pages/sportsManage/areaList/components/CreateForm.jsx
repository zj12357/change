import { Form, Input, InputNumber, Modal, Radio, Select, Cascader } from 'antd';
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

const options = [
  {
    name: '洲',
    id: 0,
    isLeaf: false,
  },
  {
    name: '国',
    id: 1,
    isLeaf: false,
  },
  {
    name: '城市',
    id: 2,
    isLeaf: false,
  },
];

@connect(({ areaListModel, loading }) => ({
  areaListModel,
  submitting: loading.effects['areaListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //区域列表
    isEditName: '新增',
    options,
    defaultValue: [],
  };
  componentDidMount() {
    const { editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    this.getAreaValue();
  }

  getAreaValue = () => {
    const { dispatch, editRoleDate = {} } = this.props;
    //获取绑定的区域
    dispatch({
      type: 'areaListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        level: editRoleDate.level,
      },
      callback: data => {
        const { options } = this.state;
        options.forEach((item, index) => {
          if (item.id == editRoleDate.level) {
            options[index].children = data.list;
          }
        });
        this.setState({
          options: [...options],
          defaultValue: [editRoleDate.level, editRoleDate.parent],
        });
      },
    });
  };
  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
  };

  loadData = selectedOptions => {
    const { dispatch } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const level = targetOption.id;
    targetOption.loading = true;

    dispatch({
      type: 'areaListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        level,
      },
      callback: data => {
        targetOption.loading = false;
        targetOption.children = data.list || [];
        this.setState({
          options: [...this.state.options],
        });
      },
    });
  };

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const parent = fieldsValue.parent;
      const editParentID = editRoleDate.parent;

      const value = { ...editRoleDate, ...fieldsValue };

      if (Array.isArray(parent) && parent.length > 1) {
        value.parent = parent[1];
      } else {
        if (editParentID) {
          value.parent = editParentID;
        } else {
          value.parent = null;
        }
      }
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
      areaListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, defaultValue } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}区域`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        // width={650}
      >
        <FormItem {...formItemLayout} label="区域名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入区域名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入区域名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="区域级别">
          {form.getFieldDecorator('level', {
            rules: [
              {
                required: true,
                message: '请选择区域级别！',
              },
            ],
            initialValue: editRoleDate.level,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择区域级别！"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              <Option value={0}>洲</Option>
              <Option value={1}>国</Option>
              <Option value={2}>城市</Option>
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="父级区域">
          {form.getFieldDecorator('parent', {
            rules: [
              {
                required: false,
                message: '请输入父级区域！',
              },
            ],
            initialValue: defaultValue,
          })(
            <Cascader
              options={this.state.options}
              loadData={this.loadData}
              onChange={this.onChange}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              notFoundContent={'暂无数据'}
              placeholder={'请选择'}
            />,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
