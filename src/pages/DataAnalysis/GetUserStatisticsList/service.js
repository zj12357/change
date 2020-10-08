import request from '@/utils/request';

//获取用户列表
export async function getList(params) {
  return request('/api/DataAnalysis/UserStatisticsReport', {
    method: 'POST',
    data: { ...params },
  });
}

//删除字典
export async function removeRule(params) {
  return request('/api/Dictionary/DeleteDictionary', {
    method: 'POST',
    data: { ...params },
  });
}

//增加字典
export async function addRule(params) {
  return request('/api/Dictionary/AddDictionary', {
    method: 'POST',
    data: { ...params },
  });
}

//修改字典
export async function ModifySysRole(params) {
  return request('/api/Dictionary/ModifyDictionary', {
    method: 'POST',
    data: { ...params },
  });
}

//获取字典类型列表
export async function DictionaryTypeList(params) {
  return request('/api/Dictionary/DictionaryTypeList', {
    method: 'POST',
    data: { ...params },
  });
}

//字典导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}

//禁用 启用
export async function enableAccounts(params) {
  return request('/role/enable', {
    method: 'POST',
    data: { ...params },
  });
}

//获取vip列表
export async function VipLevel(params) {
  return request('/api/Proxy/VipLevelList', {
    method: 'POST',
    data: { ...params },
  });
}

//获取常玩游戏列表
export async function OftenGames(params) {
  return request('/api/Proxy/OftenGames', {
    method: 'POST',
    data: { ...params },
  });
}

//获取代理线列表
export async function ProxyLine(params) {
  return request('/api/Proxy/GetProxyLineListByCurUser', {
    method: 'POST',
    data: { ...params },
  });
}

//获取提款记录
export async function GetUserWithdrawal(params) {
  return request('/api/ProxyUserInfo/GetUserWithdrawalList', {
    method: 'POST',
    data: { ...params },
  });
}
//获取存款记录
export async function GetUserDesposit(params) {
  return request('/api/ProxyUserInfo/GetUserDespositList', {
    method: 'POST',
    data: { ...params },
  });
}
//获取用户信息
export async function GetUserDetailCollection(params) {
  return request('/api/ProxyUserInfo/GetUserDetailCollectionList', {
    method: 'POST',
    data: { ...params },
  });
}
//获取用户历史投注记录
export async function GetUserBetsDetailHistory(params) {
  return request('/api/ProxyUserInfo/GetUserBetsDetailHistory', {
    method: 'POST',
    data: { ...params },
  });
}
