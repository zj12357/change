import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
        immer: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  history: 'hash',
  // 默认是 browser
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          // Routes: ['src/pages/Authorized'],
          routes: [
            {
              path: '/',
              redirect: '/Welcome',
            },
            {
              path: '/Welcome',
              name: '欢迎使用',
              icon: 'unordered-list',
              hideInMenu: 'hideInMenu',
              component: './Welcome',
            },
            {
              path: '/systemManage',
              icon: 'unordered-list',
              name: '系统管理',
              routes: [
                {
                  name: '用户管理',
                  path: '/systemManage/userMange',
                  component: './systemManage/userMange',
                },
                {
                  name: '部门管理',
                  path: '/systemManage/department',
                  component: './systemManage/department',
                },
                {
                  name: '角色管理',
                  path: '/systemManage/roleList',
                  component: './systemManage/roleList',
                },
                {
                  name: '系统菜单',
                  path: '/systemManage/systemMenu',
                  component: './systemManage/systemMenu',
                }, //  {
                //   name: '设备操作日志',
                //   path: '/systemManage/logList',
                //   component: './systemManage/logList',
                // },
                // {
                //   name: '权限管理',
                //   path: '/systemManage/resourceList',
                //   component: './systemManage/resourceList',
                // },
                {
                  name: '字典管理',
                  path: '/systemManage/dictionaryList',
                  component: './systemManage/dictionaryList',
                },
                {
                  name: '日志列表',
                  path: '/systemManage/journalList',
                  component: './systemManage/journalList',
                },
                {
                  name: '管理员操作日志列表',
                  path: '/systemManage/SysOperatedLogList',
                  component: './systemManage/SysOperatedLogList',
                },
                {
                  name: '用户操作日志列表',
                  path: '/systemManage/SysUserOperatedLogList',
                  component: './systemManage/SysUserOperatedLogList',
                },
              ],
            },
            {
              path: '/agentManage',
              icon: 'unordered-list',
              name: '代理管理',
              routes: [
                {
                  name: '采集器管理',
                  path: '/agentManage/collectorList',
                  component: './agentManage/collectorList',
                },
                {
                  name: '采集器用途管理',
                  path: '/agentManage/collectorpPurpose',
                  component: './agentManage/collectorpPurpose',
                },
                {
                  name: '采集域名管理',
                  path: '/agentManage/collectorpDomain',
                  component: './agentManage/collectorpDomain',
                },
                {
                  name: '代理线管理',
                  path: '/agentManage/agentLine',
                  component: './agentManage/agentLine',
                },
                {
                  name: '登录域名列表',
                  path: '/agentManage/LoginDomainList',
                  component: './agentManage/LoginDomainList',
                },
                {
                  name: '落地页域名绑定列表',
                  hideInMenu: 'hideInMenu',
                  path: '/agentManage/AddLandingPageDomain',
                  component: './agentManage/AddLandingPageDomain',
                },
                {
                  name: '用户列表',
                  path: '/agentManage/lineUserList',
                  component: './agentManage/lineUserList',
                },
                {
                  name: '用户类型列表',
                  path: '/agentManage/UserTypeList',
                  component: './agentManage/UserTypeList',
                },
              ],
            },
            {
              path: '/sportsManage',
              icon: 'unordered-list',
              name: '体育管理',
              routes: [
                {
                  name: '区域管理',
                  path: '/sportsManage/areaList',
                  component: './sportsManage/areaList',
                },
                {
                  name: '联赛管理',
                  path: '/sportsManage/unionList',
                  component: './sportsManage/unionList',
                },
                {
                  name: '球队管理',
                  path: '/sportsManage/teamList',
                  component: './sportsManage/teamList',
                },
                {
                  name: '预测记录列表',
                  path: '/sportsManage/PredictionRecordList',
                  component: './sportsManage/PredictionRecordList',
                },
                {
                  name: '赛事列表',
                  path: '/sportsManage/matchList',
                  component: './sportsManage/matchList',
                },
                {
                  name: '盘口信息列表',
                  path: '/sportsManage/HandicaList',
                  component: './sportsManage/HandicaList',
                },
                {
                  name: '情报列表',
                  path: '/sportsManage/InformationList',
                  component: './sportsManage/InformationList',
                },
              ],
            },
            {
              path: '/lotteryManage',
              icon: 'unordered-list',
              name: '彩票管理',
              routes: [
                {
                  name: '彩种分类列表',
                  path: '/lotteryManage/LotteryTypeList',
                  component: './lotteryManage/LotteryTypeList',
                },
                {
                  name: '彩种特性列表',
                  path: '/lotteryManage/LotteryFeatureList',
                  component: './lotteryManage/LotteryFeatureList',
                },
                {
                  name: '彩种列表',
                  path: '/lotteryManage/LotteryCategoryList',
                  component: './lotteryManage/LotteryCategoryList',
                },
                {
                  name: '开奖记录',
                  path: '/lotteryManage/LotteryList',
                  component: './lotteryManage/LotteryList',
                },
                {
                  name: '预测记录列表',
                  path: '/lotteryManage/LotteryRecordList',
                  component: './lotteryManage/LotteryRecordList',
                },
              ],
            },
            {
              path: '/SysSettings',
              icon: 'unordered-list',
              name: '系统设置',
              routes: [
                {
                  name: '系统广告图列表',
                  path: '/SysSettings/GetBannerList',
                  component: './SysSettings/GetBannerList',
                },
                {
                  name: '系统公告列表',
                  path: '/SysSettings/GetNoticeList',
                  component: './SysSettings/GetNoticeList',
                },
                {
                  name: '系统平台列表',
                  path: '/SysSettings/GetSYSPlatformList',
                  component: './SysSettings/GetSYSPlatformList',
                },
                {
                  name: 'IP黑名单列表',
                  path: '/SysSettings/GetSYSBlacklistList',
                  component: './SysSettings/GetSYSBlacklistList',
                },
                {
                  name: '屏蔽词列表',
                  path: '/SysSettings/GetSYSBlackWordList',
                  component: './SysSettings/GetSYSBlackWordList',
                },
                {
                  name: '屏蔽记录列表',
                  path: '/SysSettings/GetSYSBlackRecordList',
                  component: './SysSettings/GetSYSBlackRecordList',
                },
                {
                  name: '模块类型列表',
                  path: '/SysSettings/GetSysTemplateTypeList',
                  component: './SysSettings/GetSysTemplateTypeList',
                },
                {
                  name: '短信模板列表',
                  path: '/SysSettings/GetSysTemplateConfigList',
                  component: './SysSettings/GetSysTemplateConfigList',
                },
                {
                  name: '短信记录列表',
                  path: '/SysSettings/GetSysTemplateRecordList',
                  component: './SysSettings/GetSysTemplateRecordList',
                },
                {
                  name: '关于我们列表',
                  path: '/SysSettings/GetAboutUsList',
                  component: './SysSettings/GetAboutUsList',
                },
                {
                  name: '推送记录列表',
                  path: '/SysSettings/PushRecordList',
                  component: './SysSettings/PushRecordList',
                },
              ],
            },
            {
              path: '/newsManage',
              icon: 'unordered-list',
              name: '资讯管理',
              routes: [
                {
                  name: '资讯类型列表',
                  path: '/newsManage/newsTypeList',
                  component: './newsManage/newsTypeList',
                },
                {
                  name: '资讯列表',
                  path: '/newsManage/InformationList',
                  component: './newsManage/InformationList',
                },
                {
                  name: '资讯评论列表',
                  path: '/newsManage/GetCommentInfoList',
                  component: './newsManage/GetCommentInfoList',
                },
              ],
            },
            {
              path: '/videoMange',
              icon: 'unordered-list',
              name: '视频管理',
              routes: [
                {
                  name: '视频类型列表',
                  path: '/videoMange/VideoTypeList',
                  component: './videoMange/VideoTypeList',
                },
                {
                  name: '视频列表',
                  path: '/videoMange/VideoList',
                  component: './videoMange/VideoList',
                },
                {
                  name: '视频评论列表',
                  path: '/videoMange/VideoCommentList',
                  component: './videoMange/VideoCommentList',
                },
              ],
            },
            {
              path: '/chatRoomManage',
              icon: 'unordered-list',
              name: '聊天室管理',
              hideInMenu: 'hideInMenu',
              routes: [
                {
                  name: '聊天室列表',
                  hideInMenu: 'hideInMenu',
                  path: '/chatRoomManage/charRoomList',
                  component: './chatRoomManage/charRoomList',
                },
                {
                  name: '聊天室详情',
                  hideInMenu: 'hideInMenu',
                  path: '/chatRoomManage/charRoomDetails',
                  component: './chatRoomManage/charRoomDetails',
                },
                {
                  name: '敏感字列表',
                  hideInMenu: 'hideInMenu',
                  path: '/chatRoomManage/GetSensitiveWords',
                  component: './chatRoomManage/GetSensitiveWords',
                },
              ],
            },
            {
              path: '/userServices',
              icon: 'unordered-list',
              name: '用户服务',
              routes: [
                {
                  name: '用户反馈列表',
                  path: '/userServices/feedbackList',
                  component: './userServices/feedbackList',
                },
                {
                  name: '用户信息列表',
                  path: '/userServices/UserInfoList',
                  component: './userServices/UserInfoList',
                },
              ],
            },
            {
              path: '/LandingPage',
              icon: 'unordered-list',
              name: '落地页管理',
              routes: [
                {
                  name: '落地页列表',
                  path: '/LandingPage/LandingPageList',
                  component: './LandingPage/LandingPageList',
                },
                {
                  name: '广告图列表',
                  hideInMenu: 'hideInMenu',
                  path: '/LandingPage/AdvertisingList',
                  component: './LandingPage/AdvertisingList',
                },
                {
                  name: '背景图列表',
                  hideInMenu: 'hideInMenu',
                  path: '/LandingPage/BackgroundList',
                  component: './LandingPage/BackgroundList',
                },
                {
                  name: '轮播图列表',
                  hideInMenu: 'hideInMenu',
                  path: '/LandingPage/BannerList',
                  component: './LandingPage/BannerList',
                },
                {
                  name: '落地页公告列表',
                  hideInMenu: 'hideInMenu',
                  path: '/LandingPage/NoticeList',
                  component: './LandingPage/NoticeList',
                },
                {
                  name: '客服链接列表',
                  hideInMenu: 'hideInMenu',
                  path: '/LandingPage/CustomerList',
                  component: './LandingPage/CustomerList',
                },
                {
                  name: '落地页域名信息列表',
                  hideInMenu: 'hideInMenu',
                  path: '/LandingPage/LandingDomainList',
                  component: './LandingPage/LandingDomainList',
                },
                {
                  name: '活动关联列表',
                  hideInMenu: 'hideInMenu',
                  path: '/LandingPage/landingRelationActivity',
                  component: './LandingPage/landingRelationActivity',
                },
              ],
            },
            {
              path: '/Promotion',
              icon: 'unordered-list',
              name: '活动管理',
              routes: [
                {
                  name: '活动列表',
                  path: '/Promotion/PromotionList',
                  component: './Promotion/PromotionList',
                },
                {
                  name: '活动申请列表',
                  path: '/Promotion/ApplyList',
                  component: './Promotion/ApplyList',
                },
                {
                  name: '活动分类列表',
                  path: '/Promotion/classification',
                  component: './Promotion/classification',
                },
              ],
            },
            {
              path: '/Domain',
              icon: 'unordered-list',
              name: '域名管理',
              routes: [
                {
                  name: '域名列表',
                  path: '/Domain/DomainList',
                  component: './Domain/DomainList',
                },
                {
                  name: '域名解析列表',
                  path: '/Domain/DomainDnsList',
                  component: './Domain/DomainDnsList',
                },
                {
                  name: '短域名列表',
                  path: '/Domain/GetShortDomainList',
                  component: './Domain/GetShortDomainList',
                },
                {
                  name: '短链接生成列表',
                  path: '/Domain/GenerationList',
                  component: './Domain/GenerationList',
                },
                {
                  name: '域名参数列表',
                  path: '/Domain/ParameterList',
                  component: './Domain/ParameterList',
                },
                {
                  name: '短链接生成明细列表',
                  path: '/Domain/GetGenerateDetailList',
                  component: './Domain/GetGenerateDetailList',
                },
              ],
            },
            {
              path: '/Mobile',
              icon: 'unordered-list',
              name: '号码管理',
              routes: [
                {
                  name: '数据渠道列表',
                  path: '/Mobile/ChannelList',
                  component: './Mobile/ChannelList',
                },
                {
                  name: '数据来源列表',
                  path: '/Mobile/SourceList',
                  component: './Mobile/SourceList',
                },
                {
                  name: '号码库列表',
                  path: '/Mobile/MobileList',
                  component: './Mobile/MobileList',
                },
                {
                  name: '号码归属地列表',
                  path: '/Mobile/AttributionList',
                  component: './Mobile/AttributionList',
                },
                {
                  name: '号码供应商列表',
                  path: '/Mobile/SupplyList',
                  component: './Mobile/SupplyList',
                },
                {
                  name: '号码分配列表',
                  path: '/Mobile/DistributionList',
                  component: './Mobile/DistributionList',
                },
              ],
            },
            {
              path: '/DataAnalysis',
              icon: 'unordered-list',
              name: '数据分析服务',
              routes: [
                {
                  name: '首充排行榜',
                  path: '/DataAnalysis/GetFirstDespositRank',
                  component: './DataAnalysis/GetFirstDespositRank',
                },
                {
                  name: '代理线新增排行榜',
                  path: '/DataAnalysis/GetProxyUserAddRank',
                  component: './DataAnalysis/GetProxyUserAddRank',
                },
                {
                  name: '存款金额排行榜',
                  path: '/DataAnalysis/GetDespositRank',
                  component: './DataAnalysis/GetDespositRank',
                },
                {
                  name: '代理线存款金额排行榜',
                  path: '/DataAnalysis/GetProxyDespositRank',
                  component: './DataAnalysis/GetProxyDespositRank',
                },
                {
                  name: '流水排行榜',
                  path: '/DataAnalysis/GetBetRank',
                  component: './DataAnalysis/GetBetRank',
                },
                {
                  name: '代理流水排行榜',
                  path: '/DataAnalysis/GetProxyBetRank',
                  component: './DataAnalysis/GetProxyBetRank',
                },
                {
                  name: '负盈利贡献排行',
                  path: '/DataAnalysis/GetProfitRank',
                  component: './DataAnalysis/GetProfitRank',
                },
                {
                  name: '代理线负盈利贡献排行榜',
                  path: '/DataAnalysis/GetProxyProfitRank',
                  component: './DataAnalysis/GetProxyProfitRank',
                },
                {
                  name: '复存机率排行榜',
                  path: '/DataAnalysis/GetProxyMultipleDespositRank',
                  component: './DataAnalysis/GetProxyMultipleDespositRank',
                },
                {
                  name: '代理线30天内首存',
                  path: '/DataAnalysis/GetFirstDespositList',
                  component: './DataAnalysis/GetFirstDespositList',
                },
                {
                  name: '在线用户列表',
                  path: '/DataAnalysis/GetOnLineUserList',
                  component: './DataAnalysis/GetOnLineUserList',
                },
                {
                  name: '代理线30天内复充统计',
                  path: '/DataAnalysis/GetUserMultipleDespositList',
                  component: './DataAnalysis/GetUserMultipleDespositList',
                },
                {
                  name: '落地页用户量排行榜',
                  path: '/DataAnalysis/GetLandingPageRateList',
                  component: './DataAnalysis/GetLandingPageRateList',
                },
                {
                  name: '落地页访问率PV排行',
                  path: '/DataAnalysis/GetLandingPageByPVRateList',
                  component: './DataAnalysis/GetLandingPageByPVRateList',
                },
                {
                  name: '落地页访问率IP排行',
                  path: '/DataAnalysis/GetLandingPageByIPRateList',
                  component: './DataAnalysis/GetLandingPageByIPRateList',
                },
                {
                  name: '异常列表',
                  path: '/DataAnalysis/GetExceptionUserList',
                  component: './DataAnalysis/GetExceptionUserList',
                },
                {
                  name: '联系方式列表',
                  path: '/DataAnalysis/GetUserContactList',
                  component: './DataAnalysis/GetUserContactList',
                },
                {
                  name: '代理每日数据列表',
                  path: '/DataAnalysis/GetProxyTodayReport',
                  component: './DataAnalysis/GetProxyTodayReport',
                },
                {
                  name: '用户统计列表',
                  path: '/DataAnalysis/GetUserStatisticsList',
                  component: './DataAnalysis/GetUserStatisticsList',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '',
    // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    // 添加这个自定义的环境变量
    'process.env.UMI_APP_ENV': process.env.UMI_APP_ENV, // * 本地开发环境：dev，测试服：test，正式服：pro
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin, // proxy: {
  //   '/server/api': {
  //     // target:'https://admin.ifasia.ltd/api/exhibitionAdmin/',
  //     // target: 'http://47.108.67.75/exhibitionAdmin/',
  //     // target: 'http://wxqy.sfhaox.cn/sfhx-admin',
  //     target: 'http://119.8.126.168:5000',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/server/api': '',
  //     },
  //   },
  // },
};
