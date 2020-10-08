import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}

//根据登录用户获取路由菜单权限
export async function getResourceByAdminId() {
  return request('/server/api/resource/getResourceByAdminId');
}

//获取后台所有菜单 GET /resource/getFunctionTree查询所有的资源信息（树形结构）
export async function getFunctionTree() {
  return request(`/api/SysMenu/SysNavigationList`, {
    method: 'POST',
  });
}


//查询字典列表
export async function DictionaryList(params) {
  return request('/api/Dictionary/DictionaryList', {
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

//修改密码
export async function ModifyPassword(params) {
  return request('/api/SysUser/ModifyPassword', {
    method: 'POST',
    data: { ...params },
  });
}
