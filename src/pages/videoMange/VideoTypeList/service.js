import request from '@/utils/request';


//获取视频类型列表
export async function getList(params) {
  return request('/api/Video/VideoTypeList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加视频类型
export async function addRule(params) {
  return request('/api/Video/AddVideoType', {
    method: 'POST',
    data: { ...params },
  });
}


//修改视频类型
export async function ModifySysRole(params) {
  return request('/api/Video/ModifyVideoType', {
    method: 'POST',
    data: { ...params },
  });
}


//删除视频类型
export async function removeRule(params) {
  return request('/api/Video/DeleteVideoType', {
    method: 'POST',
    data: { ...params },
  });
}

//单个视频类型
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//视频类型导航
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
