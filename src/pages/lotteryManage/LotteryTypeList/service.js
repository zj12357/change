import request from '@/utils/request';


//获取彩种分类列表
export async function getList(params) {
  return request('/api/Lottery/LotteryTypeList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加彩种分类
export async function addRule(params) {
  return request('/api/Lottery/AddLotteryType', {
    method: 'POST',
    data: { ...params },
  });
}


//修改彩种分类
export async function ModifySysRole(params) {
  return request('/api/Lottery/ModifyLotteryType', {
    method: 'POST',
    data: { ...params },
  });
}


//删除彩种分类
export async function removeRule(params) {
  return request('/api/Lottery/DeleteLotteryType', {
    method: 'POST',
    data: { ...params },
  });
}



//彩种分类导航
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
