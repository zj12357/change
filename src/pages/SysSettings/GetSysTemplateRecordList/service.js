import request from '@/utils/request';


//获取短信记录列表
export async function getList(params) {
  return request('/api/SysSettings/GetSysTemplateRecordList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加短信记录
export async function addRule(params) {
  return request('/api/SysSettings/AddSysTemplateRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//修改短信记录
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifySysTemplateRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//删除短信记录
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteSysTemplateRecord', {
    method: 'POST',
    data: { ...params },
  });
}

//单个短信记录
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//短信记录导航
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
