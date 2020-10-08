import request from '@/utils/request';


//获取屏蔽词列表
export async function getList(params) {
  return request('/api/SysSettings/GetSYSBlackWordList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加屏蔽词
export async function addRule(params) {
  return request('/api/SysSettings/AddSYSBlackWord', {
    method: 'POST',
    data: { ...params },
  });
}


//修改屏蔽词
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifySYSBlackWord', {
    method: 'POST',
    data: { ...params },
  });
}


//删除屏蔽词
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteSYSBlackWord', {
    method: 'POST',
    data: { ...params },
  });
}

//单个屏蔽词
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//屏蔽词导航
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
