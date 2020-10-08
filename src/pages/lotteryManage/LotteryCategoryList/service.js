import request from '@/utils/request';


//获取彩钟列表
export async function getList(params) {
  return request('/api/Lottery/LotteryCategoryList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加彩钟
export async function addRule(params) {
  return request('/api/Lottery/AddLotteryCategory', {
    method: 'POST',
    data: { ...params },
  });
}


//修改彩钟
export async function ModifySysRole(params) {
  return request('/api/Lottery/ModifyLotteryCategory', {
    method: 'POST',
    data: { ...params },
  });
}


//删除彩钟
export async function removeRule(params) {
  return request('/api/Lottery/DeleteLotteryCategory', {
    method: 'POST',
    data: { ...params },
  });
}



//彩钟导航
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
