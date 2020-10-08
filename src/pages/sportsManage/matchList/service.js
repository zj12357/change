import request from '@/utils/request';


//获取赛事列表
export async function getList(params) {
  return request('/api/Sports/CompetitionList', {
    method: 'POST',
    data: { ...params },
  });
}


export async function CompetitionList(params) {
  return request('/api/Sports/InformationList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加赛事
export async function addRule(params) {
  return request('/api/Sports/AddCompetition', {
    method: 'POST',
    data: { ...params },
  });
}


//修改赛事
export async function ModifySysRole(params) {
  return request('/api/Sports/ModifyCompetition', {
    method: 'POST',
    data: { ...params },
  });
}


//删除赛事
export async function removeRule(params) {
  return request('/api/Sports/DeleteCompetition', {
    method: 'POST',
    data: { ...params },
  });
}



//赛事导航
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
