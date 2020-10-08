import request from '@/utils/request';


//获取屏蔽记录列表
export async function getList(params) {
  return request('/api/SysSettings/GetSYSBlackRecordList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加屏蔽记录
export async function addRule(params) {
  return request('/api/SysSettings/AddSYSBlackWordRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//修改屏蔽记录
export async function ModifySysRole(params) {
  return request('/api/SysSettings/ModifySYSBlackWordRecord', {
    method: 'POST',
    data: { ...params },
  });
}


//删除屏蔽记录
export async function removeRule(params) {
  return request('/api/SysSettings/DeleteSYSBlackWordRecord', {
    method: 'POST',
    data: { ...params },
  });
}

//单个屏蔽记录
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//屏蔽记录导航
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
