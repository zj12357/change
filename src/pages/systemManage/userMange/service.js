import request from '@/utils/request';


//获取系统用户列表
export async function getList(params) {
  return request('/api/SysUser/SysUserList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加系统用户
export async function addRule(params) {
  return request('/api/SysUser/AddSysUser', {
    method: 'POST',
    data: { ...params },
  });
}


//修改系统用户
export async function ModifySysRole(params) {
  return request('/api/SysUser/ModifySysUser', {
    method: 'POST',
    data: { ...params },
  });
}


//删除系统用户
export async function removeRule(params) {
  return request('/api/SysPermission/DeleteSysPermission', {
    method: 'POST',
    data: { ...params },
  });
}

//创建用户 同步创建  平台用户
export async function RegisterUser(params) {
  return request('/api/ChatRoom/RegisterUser', {
    method: 'POST',
    data: { ...params },
  });
}

//角色分配
export async function SysUserRole(params) {
  return request('/api/SysUser/SysUserRole', {
    method: 'POST',
    data: { ...params },
  });
}




//角色分配列表
export async function SysUserRoleList(params) {
  return request('/api/SysUser/SysUserRoleList', {
    method: 'POST',
    data: { ...params },
  });
}

//权限分配列表
export async function SysUserPermissionsList(params) {
  return request('/api/SysUser/SysUserPermissionsList', {
    method: 'POST',
    data: { ...params },
  });
}

//冻结
export async function Freeze(params) {
  return request('/api/SysUser/Freeze', {
    method: 'POST',
    data: { ...params },
  });
}


//解冻
export async function UnFreeze(params) {
  return request('/api/SysUser/UnFreeze', {
    method: 'POST',
    data: { ...params },
  });
}

//修改密码（当前用户）
export async function ModifyPassword(params) {
  return request('/api/SysUser/ModifyPassword', {
    method: 'POST',
    data: { ...params },
  });
}


//修改密码（系统用户）
export async function ModifySysUserPassword(params) {
  return request('/api/SysUser/ModifySysUserPassword', {
    method: 'POST',
    data: { ...params },
  });
}
