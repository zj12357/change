import request from '@/utils/request';


//获取计划列表
export async function getList(params) {
  return request('/api/Lottery/LotteryList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加计划
export async function addRule(params) {
  return request('/api/Lottery/AddLottery', {
    method: 'POST',
    data: { ...params },
  });
}


//修改计划
export async function ModifySysRole(params) {
  return request('/api/Lottery/ModifyLottery', {
    method: 'POST',
    data: { ...params },
  });
}


//删除计划
export async function removeRule(params) {
  return request('/api/Lottery/DeleteLottery', {
    method: 'POST',
    data: { ...params },
  });
}



//计划导航
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
