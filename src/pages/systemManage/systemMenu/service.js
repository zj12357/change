import request from '@/utils/request';


//获取菜单列表
export async function getList(params) {
  return request('/api/SysMenu/SysMenuList', {
    method: 'POST',
    data: { ...params },
  });
}

//删除菜单
export async function removeRule(params) {
  return request('/api/SysMenu/DeleteSysMenu', {
    method: 'POST',
    data: { ...params },
  });
}

//增加菜单
export async function addRule(params) {
  return request('/api/SysMenu/AddSysMenu', {
    method: 'POST',
    data: { ...params },
  });
}

//修改菜单
export async function ModifySysRole(params) {
  return request('/api/SysMenu/ModifySysMenu', {
    method: 'POST',
    data: { ...params },
  });
}



//菜单导航
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


//查询所有权限
export async function SysPermissionList(params) {
  return request('/api/SysPermission/SysPermissionList', {
    method: 'POST',
    data: { ...params },
  });
}


//查询字典列表
export async function DictionaryList(params) {
  return request('/api/Dictionary/DictionaryList', {
    method: 'POST',
    data: { ...params },
  });
}