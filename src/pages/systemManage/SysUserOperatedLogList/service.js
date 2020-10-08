import request from '@/utils/request';


//获取日志列表
export async function getList(params) {
  return request('/api/SysOperatedLog/SysUserOperatedLogList', {
    method: 'POST',
    data: { ...params },
  });
}

//删除日志
export async function removeRule(params) {
  return request('/api/Dictionary/DeleteDictionary', {
    method: 'POST',
    data: { ...params },
  });
}

//增加日志
export async function addRule(params) {
  return request('/api/Dictionary/AddDictionary', {
    method: 'POST',
    data: { ...params },
  });
}

//修改日志
export async function ModifySysRole(params) {
  return request('/api/Dictionary/ModifyDictionary', {
    method: 'POST',
    data: { ...params },
  });
}

//获取日志类型列表
export async function DictionaryTypeList(params) {
  return request('/api/Dictionary/DictionaryTypeList', {
    method: 'POST',
    data: { ...params },
  });
}


//日志导航
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
