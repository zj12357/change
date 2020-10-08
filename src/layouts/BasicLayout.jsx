/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/sfLogo.png';
import { message } from 'antd';

/**
 * use Authorized check all menu item
 */

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
        <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Copyright 2020 Yabo 凡所应有,无所不有</span>
      </div>
    </>
  );
};

const BasicLayout = props => {
  const { dispatch, children, settings } = props;
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    //获取字典类型

    // dispatch({
    //   type: 'login/getsysUserPermissionList',
    // });

    dispatch({
      type: 'login/fetchGetResourceByAdminId',
      callback: trees => {
        console.log('服务器请求菜单', trees);
        if (Array.isArray(trees) && trees.length <= 0) {
          message.error('没有可访问菜单权限');
          return false;
        }
        setMenuData(trees || []);
      },
    });
  }, []);

  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        // footerRender={false}
        menuDataRender={() => menuData}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
      {process.env.NODE_ENV === 'development' ? (
        <SettingDrawer
          settings={settings}
          onSettingChange={config =>
            dispatch({
              type: 'settings/changeSetting',
              payload: config,
            })
          }
        />
      ) : null}
    </>
  );
};

export default connect(({ global, settings, login }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
