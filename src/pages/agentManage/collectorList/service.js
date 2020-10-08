import request from '@/utils/request';


//获取采集器列表
export async function getList(params) {
  return request('/api/Proxy/ProxyCollectionList', {
    method: 'POST',
    data: { ...params },
  });
}

//删除采集器
export async function removeRule(params) {
  return request('/api/Proxy/DeleteProxyCollection', {
    method: 'POST',
    data: { ...params },
  });
}

//增加采集器
export async function addRule(params) {
  return request('/api/Proxy/AddProxyCollection', {
    method: 'POST',
    data: { ...params },
  });
}

//修改采集器
export async function ModifySysRole(params) {
  return request('/api/Proxy/ModifyProxyCollection', {
    method: 'POST',
    data: { ...params },
  });
}

//获取采集器类型列表
export async function DictionaryTypeList(params) {
  return request('/api/Dictionary/DictionaryTypeList', {
    method: 'POST',
    data: { ...params },
  });
}


//采集器导航
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


//采集域名分配
export async function SysUserRole(params) {
  return request('/api/Proxy/ProxyCollectionDomain', {
    method: 'POST',
    data: { ...params },
  });
}




//采集域名分配列表
export async function SysUserRoleList(params) {
  return request('/api/Proxy/ProxyCollectionDomainList', {
    method: 'POST',
    data: { ...params },
  });
}
