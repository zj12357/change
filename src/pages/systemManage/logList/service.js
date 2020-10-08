import request from '@/utils/request';

export async function getList(params) {
  return request('/log', {
    params,
  });
}
export async function removeRule(params) {
  return request('/role/del', {
    method: 'POST',
    data: { ...params },
  });
}
export async function addRule(params) {
  return request('/role/save', {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateRule(params) {
  return request('/role/updateRule', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getRolesList(params) {
  return request('/role/getRoles', {
    params,
  });
}
export async function enableAccounts(params) {
  return request('/role/enable',{
    method: 'POST',
    data: { ...params },
  });
}

// 保存角色的权限  obj:{ role:角色id  ，resourceId：（1212，212，）选中菜单id}
export async function saveResource(params) {
  return request('/role/saveResource', {
    method: 'POST',
    data: {...params},
  });
}


//获取后台所有菜单 GET /resource/getFunctionTree查询所有的资源信息（树形结构）
export async function getFunctionTree() {
  return request(`/resource/all`);
}

//根据角色查询所有的资源信息   已分配权限回显
export async function selectRoleResource(roleId) {
  return request(`/resource/selectRoleResource/${roleId}`);
}
