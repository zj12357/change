import request from '@/utils/request';


//获取彩种特性列表
export async function getList(params) {
  return request('/api/Lottery/LotteryFeatureList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加彩种特性
export async function addRule(params) {
  return request('/api/Lottery/AddLotteryFeature', {
    method: 'POST',
    data: { ...params },
  });
}


//修改彩种特性
export async function ModifySysRole(params) {
  return request('/api/Lottery/ModifyLotteryFeature', {
    method: 'POST',
    data: { ...params },
  });
}


//删除彩种特性
export async function removeRule(params) {
  return request('/api/Lottery/DeleteLotteryFeature', {
    method: 'POST',
    data: { ...params },
  });
}



//彩种特性导航
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
