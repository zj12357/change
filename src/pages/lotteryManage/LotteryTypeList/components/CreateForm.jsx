import { Form, Input, InputNumber, Modal, Radio, Select, Cascader } from 'antd';
import React, { Component } from 'react';

import UploadImg from '@/components/Upload/UploadImg.jsx';


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


@connect(({ LotteryTypeListModel, loading }) => ({
  LotteryTypeListModel,
  submitting: loading.effects['LotteryTypeListModel/add'],
}))


class CreateForm extends Component {
  state = {
    sysMenuList: [], //彩种分类列表
    isEditName: '新增',
    options,
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    // dispatch({
    //   type: 'LotteryTypeListModel/fetch',
    //   payload: {
    //     pageIndex:1,
    //     pageSize:300,
    //   },
    //   callback:(data)=>{
    //     const { deptList = [] } = data;
    //     this.setState({sysMenuList:deptList})
    //   }
    // });
  }




  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // form.resetFields();
      handleAdd({ ...editRoleDate, ...fieldsValue });
    });
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, LotteryTypeListModel: { data }, submitting } = this.props;
    const { isEditName, sysMenuList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}彩种分类`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
      // width={650}
      >
        <FormItem {...formItemLayout} label="彩种分类名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入彩种分类名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入彩种分类名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="图标">
          {form.getFieldDecorator('img', {
            rules: [
              {
                required: false,
                message: '请输入图标！',
              },
            ],
            initialValue: editRoleDate.img,
          })(
            // <Input placeholder="请输入图标" />
            <UploadImg />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="排序">
          {form.getFieldDecorator('sort', {
            rules: [
              {
                required: false,
                message: '请输入排序！',
              },
            ],
            initialValue: editRoleDate.sort,
          })(<InputNumber min={1} placeholder="请输入排序" style={{ width: "100%" }} />)}
        </FormItem>




      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
