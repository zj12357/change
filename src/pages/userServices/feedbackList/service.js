import request from '@/utils/request';


//获取用户反馈列表
export async function getList(params) {
  return request('/api/User/GetCMFeedbackList', {
    method: 'POST',
    data: { ...params },
  });
}

//反馈详情
export async function DetailCMFeedback(params) {
  return request('/api/User/DetailCMFeedback', {
    method: 'POST',
    data: { ...params },
  });
}


//回复反馈
export async function ProcessCMFeedback(params) {
  return request('/api/User/ProcessCMFeedback', {
    method: 'POST',
    data: { ...params },
  });
}


//增加用户反馈
export async function addRule(params) {
  return request('/api/Video/AddVideoType', {
    method: 'POST',
    data: { ...params },
  });
}


//修改用户反馈
export async function ModifySysRole(params) {
  return request('/api/Video/ModifyVideoType', {
    method: 'POST',
    data: { ...params },
  });
}


//删除用户反馈
export async function removeRule(params) {
  return request('/api/Video/DeleteVideoType', {
    method: 'POST',
    data: { ...params },
  });
}

//单个用户反馈
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//用户反馈导航
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
