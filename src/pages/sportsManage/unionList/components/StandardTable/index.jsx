import { Alert, Table } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './index.less';
import { genID, flatArrs } from '@/utils/utils.js';
import { keysID, listId } from '../../keys.js';
function initTotalList(columns) {
  if (!columns) {
    return [];
  }

  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends Component {
  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    /*
      rowSelection={rowSelection}
      size={'middle'}
    */
    const { data } = this.props;
    const { list = [] } = data || {};
    const selectedRowsParent = this.props.selectedRows;
    const maxLength = list.length;
    if (selectedRowKeys === 0) {
    } else if (selectedRowKeys.length === maxLength) {
      if (selectedRowsParent[0]) {
        selectedRows = [];
        selectedRowKeys = [];
      } else {
        selectedRows = [selectedRows.shift()];
        selectedRowKeys = [selectedRowKeys.shift()];
      }
    } else {
      selectedRowKeys = selectedRowKeys.length ? [selectedRowKeys.pop()] : selectedRowKeys;
      selectedRows = selectedRows.length
        ? selectedRows.filter(item => item[keysID] === selectedRowKeys[0])
        : selectedRows;
    }
    const currySelectedRowKeys = selectedRowKeys;
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;

    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({
      selectedRowKeys: currySelectedRowKeys,
      needTotalList,
    });
  };

  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={record => record[keysID]}
          rowSelection={rowSelection}
          size={'middle'}
          dataSource={list}
          pagination={paginationProps}
          // pagination={false}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
