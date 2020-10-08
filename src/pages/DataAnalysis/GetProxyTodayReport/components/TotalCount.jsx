import React, { Component } from 'react';
import { Descriptions, Table } from 'antd';
import '../style.less';
import { genID, toMoney, toPercentInt } from '@/utils/utils.js';

class TotalCount extends Component {
  constructor(props) {
    super(props);
    this.firstRef = React.createRef();
  }
  state = {
    countList: [],
  };
  componentDidMount() {
    this.addScroll();
  }
  componentWillUnmount() {
    this.removeScroll();
  }

  addScroll = () => {
    document.getElementsByClassName('ant-table-body')[1].addEventListener('scroll', function(e) {
      let width = document.getElementsByClassName('ant-table-body')[1].scrollLeft;
      document.getElementsByClassName('ant-table-body')[0].scrollLeft = width;
    });
  };
  removeScroll = () => {
    document.getElementsByClassName('ant-table-body')[1].removeEventListener('scroll', function(e) {
      let width = document.getElementsByClassName('ant-table-body')[1].scrollLeft;
      document.getElementsByClassName('ant-table-body')[0].scrollLeft = width;
    });
  };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.data.list.length === 0) {
      return {
        countList: [],
      };
    }
    return {
      countList: nextProps.data.list,
    };
  }
  getTotal = (val, isMoney) => {
    const { countList } = this.state;
    let count = 0;
    countList.map(item => {
      count += item[val];
    });
    if (isMoney) {
      return toMoney(count);
    }
    return count;
  };
  getRate = (total = 0, personNum = 0, rateText = false, isColor = false) => {
    let rate = this.getTotal(total) / this.getTotal(personNum);
    return (
      <span className={isColor ? 'textColor' : ''}>
        {this.getTotal(personNum) !== 0 ? parseInt(rate * 100) + (rateText ? '%' : '') : 0}
      </span>
    );
  };
  render() {
    let columns = [
      {
        title: '代理线',
        dataIndex: 'plName',
        fixed: 'left',
        width: 120,
      },
      {
        title: '总用户',
        dataIndex: 'plAllUserQty',
      },
      {
        title: '月充值',
        dataIndex: 'mDepUserQty',
      },
      {
        title: '充值4+',
        dataIndex: 'mDep4UserQty',
      },
      {
        title: '日新增',
        dataIndex: 'dAddUserQty',
      },
      {
        title: '7日留存',
        dataIndex: 'd7ActUserQty',
      },
      {
        title: '昨7日留存',
        dataIndex: 'd8ActUserQty',
      },
      {
        title: '15日留存',
        dataIndex: 'd15ActUserQty',
      },
      {
        title: '昨15日留存',
        dataIndex: 'd16ActUserQty',
      },
      {
        title: '日在线',
        dataIndex: 'dOnLineUserQty',
      },
      {
        title: '昨在线',
        dataIndex: 'bdOnLineUserQty',
      },

      {
        title: '在线率',
        dataIndex: 'dOnLineRate',
      },
      {
        title: '月新增',
        dataIndex: 'mAddUserQty',
      },
      {
        title: '月活跃',
        dataIndex: 'mActUserQty',
      },
      {
        title: '月超级活跃',
        dataIndex: 'msActUserQty',
      },
      {
        title: '月活率',
        dataIndex: 'mActUserRate',
      },
      {
        title: '日复充',
        dataIndex: 'dmDepQty',
      },
      {
        title: '日存款',
        dataIndex: 'dDepAmt',
      },
      {
        title: '日提款',
        dataIndex: 'dWitAmt',
      },
      {
        title: '日流水',
        dataIndex: 'dBetsAmt',
      },
      {
        title: '日输赢',
        dataIndex: 'dProAmt',
      },
      {
        title: '日均存款',
        dataIndex: 'dAvgDepAmt',
      },
      {
        title: '日均输赢',
        dataIndex: 'dayAvgProfitAmt',
      },
      {
        title: '日均流水',
        dataIndex: 'dAvgBetsAmt',
      },
      {
        title: '月复充',
        dataIndex: 'mMulDepUserQty',
      },
      {
        title: '月存款',
        dataIndex: 'mDepAmt',
      },
      {
        title: '月提款',
        dataIndex: 'mWitAmt',
      },
      {
        title: '月流水',
        dataIndex: 'mBetsAmt',
      },
      {
        title: '月输赢',
        dataIndex: 'mProAmt',
      },
      {
        title: '流水比例',
        dataIndex: 'mBetsRate',
      },
      {
        title: '流水杀率',
        dataIndex: 'mBetsKillRate',
      },
      {
        title: '存款杀率',
        dataIndex: 'mDepRate',
      },
      {
        title: '月均存款',
        dataIndex: 'mDepAvgAmt',
      },
      {
        title: '月均输赢',
        dataIndex: 'mProAvgAmt',
      },
      {
        title: '月均流水',
        dataIndex: 'mBetsAvgAmt',
      },
      {
        title: '月在线',
        dataIndex: 'mOnLineUserQty',
      },
      {
        title: '日存款人数',
        dataIndex: 'dDepUserQty',
      },
    ];
    let dataColumns = [
      {
        key: '1',
        plName: '总计',
        plAllUserQty: this.getTotal('plAllUserQty'),
        mDepUserQty: this.getTotal('mDepUserQty'),
        mDep4UserQty: this.getTotal('mDep4UserQty'),
        dAddUserQty: this.getTotal('dAddUserQty'),
        d7ActUserQty: this.getTotal('d7ActUserQty'),
        d8ActUserQty: this.getTotal('d8ActUserQty'),
        d15ActUserQty: this.getTotal('d15ActUserQty'),
        d16ActUserQty: this.getTotal('d16ActUserQty'),
        dOnLineUserQty: this.getTotal('dOnLineUserQty'),
        bdOnLineUserQty: this.getTotal('bdOnLineUserQty'),
        dOnLineRate: this.getRate('dOnLineUserQty', 'mOnLineUserQty', true, true),
        mAddUserQty: this.getTotal('mAddUserQty'),
        mActUserQty: this.getTotal('mActUserQty'),
        msActUserQty: this.getTotal('msActUserQty'),
        mActUserRate: this.getRate('mActUserQty', 'mOnLineUserQty', true, true),
        dmDepQty: this.getTotal('dmDepQty'),
        dDepAmt: this.getTotal('dDepAmt', true),
        dWitAmt: this.getTotal('dWitAmt', true),
        dBetsAmt: this.getTotal('dBetsAmt', true),
        dProAmt: this.getTotal('dProAmt', true),
        dAvgDepAmt: this.getRate('dDepAmt', 'dDepUserQty', false),
        dayAvgProfitAmt: this.getRate('dProAmt', 'dDepUserQty', false),
        dAvgBetsAmt: this.getRate('dBetsAmt', 'dDepUserQty', false),
        mMulDepUserQty: this.getTotal('mMulDepUserQty'),
        mDepAmt: this.getTotal('mDepAmt', true),
        mWitAmt: this.getTotal('mWitAmt', true),
        mBetsAmt: this.getTotal('mBetsAmt', true),
        mProAmt: this.getTotal('mProAmt', true),
        mBetsRate: this.getRate('mBetsAmt', 'mDepAmt', false, true),
        mBetsKillRate: this.getRate('mProAmt', 'mBetsAmt', true, true),
        mDepRate: this.getRate('mProAmt', 'mDepAmt', true, true),
        mDepAvgAmt: this.getRate('mDepAmt', 'mOnLineUserQty', false),
        mProAvgAmt: this.getRate('mProAmt', 'mOnLineUserQty', false),
        mBetsAvgAmt: this.getRate('mBetsAmt', 'mOnLineUserQty', false),
        mOnLineUserQty: this.getTotal('mOnLineUserQty'),
        dDepUserQty: this.getTotal('dDepUserQty'),
      },
    ];
    return (
      <div className="standardTableCount">
        <Table
          rowKey={() => genID()}
          columns={columns}
          dataSource={dataColumns}
          pagination={false}
          scroll={{ x: 5400 }}
          showHeader={false}
          ref={this.firstRef}
        />
      </div>
    );
  }
}

export default TotalCount;
