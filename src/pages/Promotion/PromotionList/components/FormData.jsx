import { Form, Input, Modal, Icon, Button } from 'antd';
import React, { Component, Fragment } from 'react';

import { genID, isString } from '@/utils/utils.js';
import InputForm from './InputForm.jsx';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 22,
  },
};

function analysisJsonStr(str) {
  let arr = [];

  if (Array.isArray(str)) return str;

  if (typeof str !== 'string') return arr;

  try {
    arr = JSON.parse(str);
  } catch (error) {
    arr = [];
  }

  return Array.isArray(arr) ? arr : [];
}

class FormData extends Component {
  state = {};
  componentDidMount() {
    const value = analysisJsonStr(this.props.editRoleDate);
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((item, index) => {
        this.add(index);
      });
    } else {
      this.add();
    }
  }

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // if (keys.length === 1) {
    //     return;
    // }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = id => {
    const { form } = this.props;

    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id || genID());

    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    const { form, updataPromotionRule } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        const namesArr = keys.map(key => names[key]);
        updataPromotionRule(namesArr);
        console.log('表单数据', namesArr);
      }
    });
  };

  filtArr = index => {
    let arr = analysisJsonStr(this.props.editRoleDate);
    arr = Array.isArray(arr) ? arr : [];
    return arr[index] ? arr[index] : {};
  };

  render() {
    const { modalVisible, form, handleModalVisible } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item {...formItemLayout} required={false} key={k}>
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: false,
              message: '',
            },
          ],

          initialValue: this.filtArr(index),
        })(<InputForm keys={k} />)}
        {keys.length >= 1 ? (
          <Icon
            style={{
              top: '4px',
              fontSize: '24px',
              color: '#999',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s',
              left: '6px',
            }}
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Modal
        destroyOnClose
        title={'表单内容'}
        visible={modalVisible}
        onOk={this.handleSubmit}
        onCancel={() => handleModalVisible()}
        maskClosable={false}
        width={700}
      >
        {formItems}
        <Form.Item {...formItemLayout}>
          <Button type="dashed" onClick={() => this.add('')} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加表单数据
          </Button>
        </Form.Item>
      </Modal>
    );
  }
}

export default Form.create()(FormData);
