import request from '@/utils/request';


//获取模块配置列表
export async function getList(params) {
  return request('/api/SysSettings/GetSysTemplateConfigList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加模块配置
export async function addRule(params) {
  return request('/api/SysSettings/AddSysTemplateConfig', {
    method: 'POST',
    data: { ...params },
  });
}


//修改模块配置
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifySysTemplateConfig', {
    method: 'POST',
    data: { ...params },
  });
}


//删除模块配置
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteSysTemplateConfig', {
    method: 'POST',
    data: { ...params },
  });
}

//单个模块配置
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//模块配置导航
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
