import request from '@/utils/request';


//获取模块类型列表
export async function getList(params) {
  return request('/api/SysSettings/GetSysTemplateTypeList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加模块类型
export async function addRule(params) {
  return request('/api/SysSettings/AddSysTemplateType', {
    method: 'POST',
    data: { ...params },
  });
}


//修改模块类型
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifySysTemplateType', {
    method: 'POST',
    data: { ...params },
  });
}


//删除模块类型
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteSysTemplateType', {
    method: 'POST',
    data: { ...params },
  });
}

//单个模块类型
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//模块类型导航
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
