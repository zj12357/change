import request from '@/utils/request';


//获取预测记录列表
export async function getList(params) {
  return request('/api/Sports/PredictionRecordList', {
    method: 'POST',
    data: { ...params },
  });
}

export async function CompetitionList(params) {
  return request('/api/Sports/CompetitionList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加预测记录
export async function addRule(params) {
  return request('/api/Sports/AddPredictionRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//修改预测记录
export async function ModifySysRole(params) {
  return request('/api/Sports/ModifyPredictionRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//删除预测记录
export async function removeRule(params) {
  return request('/api/Sports/DeletePredictionRecord', {
    method: 'POST',
    data: { ...params },
  });
}



//预测记录导航
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
