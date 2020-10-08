import request from '@/utils/request';


//获取开奖记录列表
export async function getList(params) {
  return request('/api/Lottery/LotteryRecordList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加开奖记录
export async function addRule(params) {
  return request('/api/Lottery/AddLotteryRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//修改开奖记录
export async function ModifySysRole(params) {
  return request('/api/Lottery/ModifyLotteryRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//删除开奖记录
export async function removeRule(params) {
  return request('/api/Lottery/DeleteLotteryRecord', {
    method: 'POST',
    data: { ...params },
  });
}



//开奖记录导航
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
