import request from '@/utils/request';


//获取角色列表
export async function getList(params) {
  return request('/api/SysRole/SysRoleList', {
    method: 'POST',
    data: { ...params },
  });
}

//删除角色
export async function removeRule(params) {
  return request('/api/SysRole/DeleteSysRole', {
    method: 'POST',
    data: { ...params },
  });
}

//增加角色
export async function addRule(params) {
  return request('/api/SysRole/AddSysRole', {
    method: 'POST',
    data: { ...params },
  });
}

//修改角色
export async function ModifySysRole(params) {
  return request('/api/SysRole/ModifySysRole', {
    method: 'POST',
    data: { ...params },
  });
}


//权限配置
export async function SysRolePermission(params) {
  return request('/api/SysRole/SysRolePermission', {
    method: 'POST',
    data: { ...params },
  });
}

//分配菜单
export async function SysRoleMenu(params) {
  return request('/api/SysRole/SysRoleMenu', {
    method: 'POST',
    data: { ...params },
  });
}


//角色权限列表
export async function SysPermissionList(params) {
  return request('/api/SysRole/SysPermissionList', {
    method: 'POST',
    data: { ...params },
  });
}


//角色菜单列表
export async function SysRoleMenusList(params) {
  return request('/api/SysRole/SysRoleMenusList', {
    method: 'POST',
    data: { ...params },
  });
}

//所有权限列表
export async function SysPermissionListAll(params) {
  return request('/api/SysPermission/SysPermissionList', {
    method: 'POST',
    data: { ...params },
  });
}


//所有菜单权限列表
export async function SysMenuList(params) {
  return request('/api/SysMenu/SysMenuList', {
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


export async function getFunctionTreeCurrent() {
  return request(`/getResource`);
}



/**
    权限管理 =>   添加所有的菜单列表
    角色管理  =>  给每个角色分配不同的菜单权限
    用户管理  =>  跟角色相关联，登录获得菜单列表
    菜单管理  =>  用来做什么?


    c
 */

