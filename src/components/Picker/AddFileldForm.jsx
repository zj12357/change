import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { genID, isString } from '@/utils/utils.js';
import TimePickerRange from '@/components/Picker/TimePickerRange.jsx';
import moment from 'moment';

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

function formatTime(str) {
  if (!str) return null;
  const reg = /^(([0-1][0-9])|([2][0-4]))(\:)[0-5][0-9](\:)[0-5][0-9]$/g;
  if (reg.test(str)) {
    return str;
  }
  return moment(str).format('HH:mm:ss');
}

class DynamicFieldSet extends React.Component {
  componentDidMount() {
    let value = analysisJsonStr(this.props.value);

    if (Array.isArray(value) && value.length > 0) {
      let isWhetherId = false;

      const arrs = value.map(item => {
        if (!item.id) {
          item.id = genID();
          isWhetherId = true;
        }

        this.add(item.id);

        return item;
      });
      const { onChange } = this.props;
      if (onChange && isWhetherId) onChange(arrs);
    } else {
      this.add();
    }
  }

  remove = k => {
    const { form, onChange } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    let value = analysisJsonStr(this.props.value);

    value = value.filter(item => item.id !== k);

    onChange(value);

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = id => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id || genID());
    // console.log(nextKeys)
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log(
          'Merged values:',
          keys.map(key => names[key]),
        );
      }
    });
  };

  filtArr = id => {
    let arr = analysisJsonStr(this.props.value);
    arr = Array.isArray(arr) ? arr : [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr[i].startTime = formatTime(arr[i].startTime);
        arr[i].endTime = formatTime(arr[i].endTime);
        return arr[i];
      }
    }
    return {};
  };

  checkDateSize = (rule, value, callback) => {
    let defaValue = analysisJsonStr(this.props.value);
    // console.log('defaValue',defaValue)

    try {
      const { startTime, endTime } = value;

      if (isString(startTime) && isString(endTime)) {
        //开始时间和结束时间同时存在

        if (
          new Date(moment(endTime, 'HH:mm:ss')) - new Date(moment(startTime, 'HH:mm:ss')) >=
          1000
        ) {
          // 结束时间不能小于于开始时间
          // utc 时间格式
          // console.log(moment(startTime,"HH:mm:ss").utc().format())

          return callback();
        }

        callback('结束时间不能小于于开始时间!');
      } else if (!isString(startTime) || !isString(endTime)) {
        callback('请填写完整时间格式!');
      } else {
        return callback();
      }
    } catch (err) {
      callback(err);
    }
  };

  //从子组件 onchange 传上来 在向父级传递
  manChangeSon = (changedValue = []) => {
    let { onChange } = this.props;

    let value = analysisJsonStr(this.props.value);

    // console.log('manChangeSon', changedValue, 'value', value);

    if (!onChange) return;
    if (!Array.isArray(value)) return;

    if (value.length <= 0) {
      onChange([...value, ...changedValue]);
      return;
    }

    let changedValueId = (changedValue[0] && changedValue[0].id) || '暂无ID';

    let isRepeat = false; //是否已存在相同id的 时间选择框

    let contrastArr = value.map(item => {
      if (changedValueId === item.id) {
        item = { ...item, ...changedValue[0] };
        isRepeat = true;
      }
      return item;
    });

    if (isRepeat) {
      onChange(contrastArr);
    } else {
      onChange([...value, ...changedValue]);
    }
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const defaultArr = this.props.value || [];
    const { value } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };

    // console.log('AddFileldForm',value)
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        // label={index === 0 ? 'Passengers' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: false,
              // whitespace: true,
              message: "Please input passenger's name or delete this field.",
            },
            {
              validator: this.checkDateSize,
            },
          ],

          initialValue: this.filtArr(k),
          //  initialValue: defaultArr,
        })(
          // <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
          <TimePickerRange manChangeSon={this.manChangeSon} keys={k} />,
        )}
        {keys.length > 1 ? (
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
    // console.log('props',this.props)
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <Form.Item {...formItemLayout}>
          <Button type="dashed" onClick={() => this.add('')} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加多时间段
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);
export default WrappedDynamicFieldSet;
