import request from '@/utils/request';


//获取资讯列表
export async function getList(params) {
  return request('/api/News/GetSysTemplateRecordList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加资讯
export async function addRule(params) {
  return request('/api/News/AddNews', {
    method: 'POST',
    data: { ...params },
  });
}


//修改资讯
export async function ModifySysRole(params) {
  return request('/api/News/ModifyNews', {
    method: 'POST',
    data: { ...params },
  });
}


//删除资讯
export async function removeRule(params) {
  return request('/api/News/DeleteNews', {
    method: 'POST',
    data: { ...params },
  });
}

//单个资讯
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//资讯导航
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
