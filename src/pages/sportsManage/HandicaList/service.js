import request from '@/utils/request';


//获取盘口信息列表
export async function getList(params) {
  return request('/api/Sports/HandicaList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加盘口信息
export async function addRule(params) {
  return request('/api/Sports/AddHandica', {
    method: 'POST',
    data: { ...params },
  });
}


//修改盘口信息
export async function ModifySysRole(params) {
  return request('/api/Sports/ModifyHandica', {
    method: 'POST',
    data: { ...params },
  });
}


//删除盘口信息
export async function removeRule(params) {
  return request('/api/Sports/DeleteHandica', {
    method: 'POST',
    data: { ...params },
  });
}



//盘口信息导航
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
