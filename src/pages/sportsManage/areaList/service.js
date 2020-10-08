import request from '@/utils/request';


//获取区域列表
export async function getList(params) {
  return request('/api/Sports/AreaList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加区域
export async function addRule(params) {
  return request('/api/Sports/AddArea', {
    method: 'POST',
    data: { ...params },
  });
}


//修改区域
export async function ModifySysRole(params) {
  return request('/api/Sports/ModifyArea', {
    method: 'POST',
    data: { ...params },
  });
}


//删除区域
export async function removeRule(params) {
  return request('/api/Sports/DeleteArea', {
    method: 'POST',
    data: { ...params },
  });
}



//区域导航
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
