import React, { forwardRef, useState, useEffect } from 'react';
import { Row, Col, DatePicker } from 'antd';
import moment from 'moment';

const CustomDatePicker = (props, ref) => {
  const { onChange, value } = props;

  const format = props.format || 'YYYY-MM-DD HH:mm:ss';

  const changeDate = val => {
    if (!val) {
      onChange(null);
      return;
    }
    let date = '';

    if (format === 'YYYY-MM-DD') {
      date = moment(val, 'YYYY-MM-DD').format();
    } else {
      date = moment(val, 'YYYY-MM-DD HH:mm:ss')
        .utc(8)
        .format();
    }

    onChange(date);
  };
  return (
    <div ref={ref} style={{ marginRight: '5px' }}>
      <Col span={8}>
        <DatePicker
          showTime
          format={format}
          allowClear={true}
          onChange={changeDate}
          value={value ? moment(value, format) : null}
          placeholder={'请选择'}
        />
      </Col>
    </div>
  );
};

export default forwardRef(CustomDatePicker);
