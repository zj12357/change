import request from '@/utils/request';


//获取推送记录列表
export async function getList(params) {
  return request('/api/SysSettings/GetPushRecordList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加推送记录
export async function addRule(params) {
  return request('/api/SysSettings/AddSYSAboutUs', {
    method: 'POST',
    data: { ...params },
  });
}


//修改推送记录
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifySYSAboutUs', {
    method: 'POST',
    data: { ...params },
  });
}


//删除推送记录
export async function removeRule(params) {
  return request('/api/SysSettings/DeletePushRecord', {params});
}

//单个推送记录
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//推送记录导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}


//禁用 启用
export async function enableAccounts(params) {
  return request('/role/enable',{
    method: 'POST',
    data: { ...params },
  });
}


//获取用户列表
export async function GetUserInfoList(params) {
  return request('/api/User/GetUserInfoList',{
    method: 'POST',
    data: { ...params },
  });
}
//推送用户消息
export async function SendPush(params) {
  return request('/api/SysSettings/AddPushRecord',{
    method: 'POST',
    data: { ...params },
  });
}
//推送所有用户消息
export async function AllSendPush(params) {
  return request('/api/SysSettings/AllSendPush',{
    method: 'POST',
    data: { ...params },
  });
}
//推送比赛消息
export async function RunSportPush(params) {
  return request('/api/SysSettings/RunSportPush',{
    method: 'POST',
    data: { ...params },
  });
}
//彩票结果推送
export async function RunLotterPush(params) {
  return request('/api/SysSettings/RunLotterPush',{
    method: 'POST',
    data: { ...params },
  });
}

//撤销极光推送
export async function DeletePush(params) {
  return request('/api/SysSettings/DeletePush',{params});
}

//极光推送消息
export async function SendPushJG(params) {
  return request('/api/SysSettings/SendPush',{params});
}