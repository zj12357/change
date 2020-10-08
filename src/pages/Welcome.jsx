import React, { Component, Fragment, Suspense } from 'react';
import {
  Card,
  Radio,
  List,
  Skeleton,
  Avatar,
  Statistic,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import style from './style.less';
import { getUserInfo } from '@/utils/utils.js';
import IntroduceRow from '@/components/Charts/components/IntroduceRow';
import OfflineData from '@/components/Charts/components/OfflineData';
import PageLoading from '@/components/Charts/components/PageLoading';
import DATAJSON from '@/components/Charts/data.json';
import { getTimeDistance } from '@/components/Charts/utils/utils';
const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={style.pageHeaderContent}>
      <div className={style.avatar}>
        <Avatar size="large" src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' />
      </div>
      <div className={style.content}>
        <div className={style.contentTitle}>
          您好，
          {currentUser.userID}
          ，祝您开心每一天！
        </div>
        <div>
          嫦娥一号欢迎您
        </div>
      </div>
    </div>
  );
};

const ExtraContent = () => (
  <div className={style.extraContent}>
    <div className={style.statItem}>
      <Statistic title="项目数" value={56} />
    </div>
    <div className={style.statItem}>
      <Statistic title="团队内排名" value={8} suffix="/ 24" />
    </div>
    <div className={style.statItem}>
      <Statistic title="项目访问" value={2223} />
    </div>
  </div>
);

@connect(({ homeModel }) => ({
  homeModel,
}))


export default class homePage extends Component {
  state = {
    loading: true,
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false })
    }, 800)
  }

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  render() {
    const userInfo = getUserInfo();
    const { records, total = 1, loading } = this.state;
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = DATAJSON;
    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={userInfo} />}
        extraContent={<ExtraContent />}
      >
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={visitData} />
        </Suspense>
        <Suspense fallback={null}>
          <OfflineData
            activeKey={activeKey}
            loading={loading}
            offlineData={offlineData}
            offlineChartData={offlineChartData}
            handleTabChange={this.handleTabChange}
          />
        </Suspense>
      </PageHeaderWrapper>
    );
  }
}
