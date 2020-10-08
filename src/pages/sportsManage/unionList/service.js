import request from '@/utils/request';


//获取联盟列表
export async function getList(params) {
  return request('/api/Sports/LeagueList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加联盟
export async function addRule(params) {
  return request('/api/Sports/AddLeague', {
    method: 'POST',
    data: { ...params },
  });
}


//修改联盟
export async function ModifySysRole(params) {
  return request('/api/Sports/ModifyLeague', {
    method: 'POST',
    data: { ...params },
  });
}


//删除联盟
export async function removeRule(params) {
  return request('/api/Sports/DeleteLeague', {
    method: 'POST',
    data: { ...params },
  });
}



//联盟导航
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
