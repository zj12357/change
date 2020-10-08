import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/sfLogo.png';
import styles from './UserLayout.less';

const footerRender = (_, defaultDom) => {
  // if (!isAntDesignPro()) {
  //   return defaultDom;
  // }

  return (
    <>
      {/* {defaultDom} */}
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>
             Copyright 2020 Yabo 凡所应有,无所不有
        </span>
      </div>
    </>
  );
};

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>嫦娥一号</span>
              </Link>
            </div>
            <div style={{margin:'25px 0 20px',color:'rgba(0, 0, 0, 0.45)'}}>嫦娥一号是数据中心最具影响力的一体化管理系统</div>
            {/*<div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>*/}
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}
        {footerRender()}
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
