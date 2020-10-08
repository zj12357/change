import request from '@/utils/request';


//获取活动列表
export async function getList(params) {
  return request('/api/Promotion/ApplyList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加活动
export async function addRule(params) {
  return request('/api/Promotion/AddApply', {
    method: 'POST',
    data: { ...params },
  });
}


//修改活动
export async function ModifySysRole(params) {
  return request('/api/Promotion/ModifyApply', {
    method: 'POST',
    data: { ...params },
  });
}


//删除活动
export async function removeRule(params) {
  return request('/api/Promotion/DeleteApply', {
    method: 'POST',
    data: { ...params },
  });
}

//单个活动
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//活动导航
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


export async function ApprovePromotion(params) {
  return request('/api/Promotion/ApprovePromotion', {
    method: 'POST',
    data: { ...params },
  });
}
