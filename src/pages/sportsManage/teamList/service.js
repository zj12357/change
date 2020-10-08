import request from '@/utils/request';


//获取球队列表
export async function getList(params) {
  return request('/api/Sports/LeagueTeamList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加球队
export async function addRule(params) {
  return request('/api/Sports/AddLeagueTeam', {
    method: 'POST',
    data: { ...params },
  });
}


//修改球队
export async function ModifySysRole(params) {
  return request('/api/Sports/ModifyLeagueTeam', {
    method: 'POST',
    data: { ...params },
  });
}


//删除球队
export async function removeRule(params) {
  return request('/api/Sports/DeleteLeagueTeam', {
    method: 'POST',
    data: { ...params },
  });
}



//球队导航
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
