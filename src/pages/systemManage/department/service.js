import request from '@/utils/request';


//获取部门列表
export async function getList(params) {
  return request('/api/Dept/DeptList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加部门
export async function addRule(params) {
  return request('/api/Dept/AddDept', {
    method: 'POST',
    data: { ...params },
  });
}


//修改部门
export async function ModifySysRole(params) {
  return request('/api/Dept/ModifyDept', {
    method: 'POST',
    data: { ...params },
  });
}


//删除部门
export async function removeRule(params) {
  return request('/api/Dept/DeleteDept', {
    method: 'POST',
    data: { ...params },
  });
}







//部门导航
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
