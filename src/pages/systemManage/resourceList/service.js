import request from '@/utils/request';


//获取权限列表
export async function getList(params) {
  return request('/api/SysPermission/SysPermissionList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加权限
export async function addRule(params) {
  return request('/api/SysPermission/AddSysPermission', {
    method: 'POST',
    data: { ...params },
  });
}


//修改权限
export async function ModifySysRole(params) {
  return request('/api/SysPermission/ModifySysPermission', {
    method: 'POST',
    data: { ...params },
  });
}


//删除权限
export async function removeRule(params) {
  return request('/api/SysPermission/DeleteSysPermission', {
    method: 'POST',
    data: { ...params },
  });
}







//权限导航
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
