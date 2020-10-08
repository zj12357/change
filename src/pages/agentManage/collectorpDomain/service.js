import request from '@/utils/request';


//获取采集域名列表
export async function getList(params) {
  return request('/api/Proxy/CollectionDomainList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加采集域名
export async function addRule(params) {
  return request('/api/Proxy/AddCollectionDomain', {
    method: 'POST',
    data: { ...params },
  });
}


//修改采集域名
export async function ModifySysRole(params) {
  return request('/api/Proxy/ModifyCollectionDomain', {
    method: 'POST',
    data: { ...params },
  });
}


//删除采集域名
export async function removeRule(params) {
  return request('/api/Proxy/DeleteCollectionDomain', {
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





