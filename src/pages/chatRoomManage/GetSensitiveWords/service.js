import request from '@/utils/request';


//获取敏感字列表
export async function getList(params) {
  return request('/api/ChatRoom/GetSensitiveWords', {
    method: 'POST',
    data: { ...params },
  });
}

//增加敏感字
export async function addRule(params) {
  return request('/api/ChatRoom/AddSensitiveWords', {
    method: 'POST',
    data: { ...params },
  });
}


//修改敏感字
export async function ModifySysRole(params) {
  return request('/api/ChatRoom/UpdateSensitiveWord', {
    method: 'POST',
    data: { ...params },
  });
}


//删除敏感字
export async function removeRule(params) {
  return request('/api/ChatRoom/RemoveSensitiveWord', {
    method: 'POST',
    data: { ...params },
  });
}

//单个敏感字
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//敏感字导航
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
