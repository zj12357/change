import request from '@/utils/request';


//获取域名列表
export async function getList(params) {
  return request('/api/DataAnalysis/GetFirstDespositList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加域名
export async function addRule(params) {
  return request('/api/Mobile/AddChannel', {
    method: 'POST',
    data: { ...params },
  });
}


//修改域名
export async function ModifySysRole(params) {
  return request('/api/Mobile/ModifyChannel', {
    method: 'POST',
    data: { ...params },
  });
}


//删除域名
export async function removeRule(params) {
  return request('/api/Mobile/DeleteChannel', {
    method: 'POST',
    data: { ...params },
  });
}

//单个域名
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//域名导航
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
