import React, { forwardRef, useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import { genID, isString } from '@/utils/utils.js';

const FormItem = Form.Item;
const { Option } = Select;

const TimePickerRange = (props, ref) => {
  const { onChange, value = {}, form } = props;

  const tempalte = {
    name: null,
    type: null,
    describe: null,
  };

  const formItemLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 17,
    },
  };

  return (
    <div ref={ref} style={{ marginRight: '5px' }}>
      <Col span={7}>
        <FormItem {...formItemLayout} label="名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请选择控件名称',
              },
            ],
            initialValue: value.name,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder={'请选择控件名称'}
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
              onChange={val => {
                onChange({ ...tempalte, ...value, name: val });
              }}
            >
              <Option value={'Username'}>游戏账号</Option>
              <Option value={'Mobile'}>手机号码</Option>
              <Option value={'RecommendName'}>推荐账号</Option>
              <Option value={'DepositAmt'}>存款金额</Option>
              <Option value={'ApplyImage'}>申请截图</Option>
            </Select>,
          )}
        </FormItem>
      </Col>
      <Col span={7}>
        <FormItem {...formItemLayout} label="类型">
          {form.getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择控件类型',
              },
            ],
            initialValue: value.type,
          })(
            <Select
              style={{ width: '100%' }}
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
              placeholder={'请选择控件类型'}
              onChange={val => {
                onChange({ ...tempalte, ...value, type: val });
              }}
            >
              <Option value={'text'}>文本</Option>
              <Option value={'file'}>文件</Option>
            </Select>,
          )}
        </FormItem>
      </Col>
      <Col span={7}>
        <FormItem {...formItemLayout} label="描述">
          {form.getFieldDecorator('describe', {
            rules: [
              {
                required: true,
                message: '请选择描述',
              },
            ],
            initialValue: value.describe,
          })(
            <Select
              style={{ width: '100%' }}
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
              placeholder={'请选择描述'}
              onChange={val => {
                onChange({ ...tempalte, ...value, describe: val });
              }}
            >
              <Option value={'请输入游戏账号'}>请输入游戏账号</Option>
              <Option value={'请输入手机号码'}>请输入手机号码</Option>
              <Option value={'请输入推荐账号'}>请输入推荐账号</Option>
              <Option value={'请输入存款金额'}>请输入存款金额</Option>
              <Option value={'请上传申请截图'}>请上传申请截图</Option>
            </Select>,
          )}
        </FormItem>
      </Col>
    </div>
  );
};

export default Form.create()(forwardRef(TimePickerRange));
