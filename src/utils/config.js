//线上服务器地址  //119.8.97.224:5000
//开发服务器地址  http://159.138.45.45:5000

//环境配置
let uploadUrl,
  imagesUrl,
  baseUrl = '';
let env = process.env.UMI_APP_ENV;
if (env === 'test') {
  //测试环境
  uploadUrl = window.location.origin;
  imagesUrl = window.location.origin;
  baseUrl = window.location.origin;
} else if (env === 'production') {
  //正式环境
  uploadUrl = window.location.origin;
  imagesUrl = window.location.origin;
  baseUrl = window.location.origin;
} else if (env === 'development') {
  //本地开发环境
  uploadUrl = 'http://159.138.45.45:5000';
  imagesUrl = 'http://dev.admin.balltvs.com';
  baseUrl = 'http://159.138.45.45:5000';
}

export { uploadUrl, imagesUrl, baseUrl };

const MenuButtonList = {
  QueryList: '查询列表',
  Add: '新增',
  Edit: '修改',
  Delete: '删除',
  DistributionRole: '分配角色',
  Frozen: '冻结用户',
  EditPassword: '修改密码',
  PermissionConfiguration: '权限配置',
  DistributionMenu: '分配角色',
  DistributionDomain: '分配域名',
  BindingCollector: '绑定采集器',
  SignIn: '登录',
  BindingMatch: '绑定赛事',
  Unbind: '取消绑定',
  UpdateForecastResults: '更新预测结果',
  ChatRoomManage: '聊天室管理',
  ViewForecast: '查看预测',
  ViewIntelligence: '查看情报',
  ViewOdds: '查看赔率',
  PushAppointMessage: '推送指定用户',
  PushAllMessage: '推送所有用户消息',
  PushMessage: '推送消息',
  UndoPush: '撤销推送',
  AuditDisplay: '审核显示',
  RecommendedComments: '推荐评论',
  Details: '详情',
  Reply: '回复',
  FreezeUnfreezeUsers: '冻结解冻用户',
  ResetPassword: '重置密码',
  IMManage: 'IM管理',
  LandingAddMore: '落地页添加更多',
  ViewScreenshot: '查看截图',
  AuditActivities: '审核活动',
  ImportMobile: '导入号码库',
  ExportMobile: '导出号码库',
};
