import request from '@/utils/request';

//获取代理线列表
export async function getList(params) {
  return request('/api/Proxy/ProxyLineList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//增加代理线
export async function addRule(params) {
  return request('/api/Proxy/AddProxyLine', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//修改代理线
export async function ModifySysRole(params) {
  return request('/api/Proxy/ModifyProxyLine', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//删除代理线
export async function removeRule(params) {
  return request('/api/Proxy/DeleteProxyLine', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//代理线用户分配
export async function SysUserRole(params) {
  return request('/api/Proxy/ProxyUser', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//代理线用户分配列表
export async function SysUserRoleList(params) {
  return request('/api/Proxy/ProxyUserList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//获取用户列表
export async function SysUserList(params) {
  return request('/api/SysUser/SysUserList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//获取落地页列表
export async function LandingDomainList(params) {
  return request('/api/LandingPage/GetAllLandingDomainList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//获取采集器列表
export async function ProxyCollectionList(params) {
  return request('/api/Proxy/ProxyCollectionList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//落地页域名分配
export async function LandingPageDomain(params) {
  return request('/api/Proxy/LandingPageDomain', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//落地页域名分配列表
export async function LandingPageDomainList(params) {
  return request('/api/Proxy/LandingPageDomainList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//采集器分配
export async function ProxyCollectionLine(params) {
  return request('/api/Proxy/ProxyCollectionLine', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//采集器分配列表
export async function ProxyCollectionLineList(params) {
  return request('/api/Proxy/ProxyCollectionLineList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//返回极验参数
export async function GetVerifyingModel(params) {
  return request('/api/Proxy/GetVerifyingModel', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//登陆返回token cokie。。
export async function GetAgetnLogin(params) {
  return request('/api/Proxy/GetAgetnLogin', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//代理线登录域名
export async function ProxyLoginDomain(params) {
  return request('/api/Proxy/ProxyLoginDomain', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//代理线登录域名列表
export async function ProxyLoginDomainList(params) {
  return request('/api/Proxy/ProxyLoginDomainList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//获取字典类型列表
export async function DictionaryTypeList(params) {
  return request('/api/Dictionary/DictionaryList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//代理可用域名列表
export async function ProxyCollectionActiveDomainList(params) {
  return request('/api/Proxy/ProxyCollectionActiveDomainList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//代理线分组
export async function GetProcyGroupList(params) {
  return request('/api/Proxy/GetProcyGroupList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function UpdateProxyGroup(params) {
  return request('/api/Proxy/UpdateProxyGroup', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
