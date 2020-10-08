import request from '@/utils/request';


//获取落地页公告列表
export async function getList(params) {
  return request('/api/LandingPage/NoticeList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加落地页公告
export async function addRule(params) {
  return request('/api/LandingPage/AddNotice', {
    method: 'POST',
    data: { ...params },
  });
}


//修改落地页公告
export async function ModifySysRole(params) {
  return request('/api/LandingPage/ModifyNotice', {
    method: 'POST',
    data: { ...params },
  });
}


//删除落地页公告
export async function removeRule(params) {
  return request('/api/LandingPage/DeleteNotice', {
    method: 'POST',
    data: { ...params },
  });
}

//单个落地页公告
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//落地页公告导航
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
