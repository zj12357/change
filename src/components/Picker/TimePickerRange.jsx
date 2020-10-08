import React, { forwardRef, useState, useEffect } from 'react';
import { Row, Col, TimePicker } from 'antd';
import moment from 'moment';
import { genID, isString } from '@/utils/utils.js';

const TimePickerRange = (props, ref) => {
  const {
    onChange,
    value = {},
    keys,
    manChangeSon, //父级传下来  把子级内容往上传递
    ...rest
  } = props;

  const [startTime, setStartTime] = useState(value.startTime || null);
  const [endTime, setEndTime] = useState(value.endTime || null);

  const triggerChange = changedValue => {
    if (onChange) {
      onChange({ startTime, endTime, ...changedValue });
    }
    if (manChangeSon) {
      let updataObj = { startTime, endTime, ...changedValue, id: keys || genID() };

      manChangeSon([updataObj]);
    }
  };

  return (
    <div ref={ref} style={{ marginRight: '5px' }}>
      <Col span={7}>
        <TimePicker
          allowClear={false}
          onChange={values => {
            setStartTime(moment(values).format('HH:mm:ss'));
            triggerChange({ startTime: moment(values).format('HH:mm:ss') });
          }}
          value={value.startTime ? moment(value.startTime, 'HH:mm:ss') : null}
          placeholder={'开始时间'}
        />
      </Col>
      <Col span={1}>~</Col>
      <Col span={7}>
        <TimePicker
          allowClear={false}
          onChange={values => {
            setEndTime(moment(values).format('HH:mm:ss'));
            triggerChange({ endTime: moment(values).format('HH:mm:ss') });
          }}
          value={value.endTime ? moment(value.endTime, 'HH:mm:ss') : null}
          placeholder={'结束时间'}
        />
      </Col>
    </div>
  );
};

export default forwardRef(TimePickerRange);
