import React, { forwardRef, useState, useEffect } from 'react';
import { Row, Col, DatePicker } from 'antd';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const CustomRangePicker = (props, ref) => {
  const { onChange, defaultDate, value } = props;
  useEffect(() => {
    onChange(defaultDate);
  }, []);
  const changeDate = val => {
    if (!val) {
      onChange(null);
      return;
    }
    const date = {
      startTime: moment(val[0], 'YYYY-MM-DD HH:mm:ss')
        .utc(8)
        .format(),
      endTime: moment(val[1], 'YYYY-MM-DD HH:mm:ss')
        .utc(8)
        .format(),
    };
    onChange(date);
  };

  return (
    <div ref={ref} style={{ marginRight: '5px' }}>
      <RangePicker
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        allowClear={true}
        onChange={changeDate}
        style={{ width: '100%' }}
        defaultValue={
          defaultDate
            ? [
                moment(defaultDate.startTime, 'YYYY-MM-DD HH:mm:ss'),
                moment(defaultDate.endTime, 'YYYY-MM-DD HH:mm:ss'),
              ]
            : null
        }

        // value={
        //   value
        //     ? [
        //         moment(value.startTime, 'YYYY-MM-DD HH:mm:ss'),
        //         moment(value.endTime, 'YYYY-MM-DD HH:mm:ss'),
        //       ]
        //     : null
        // }
      />
    </div>
  );
};

export default forwardRef(CustomRangePicker);
