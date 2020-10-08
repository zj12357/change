import request from '@/utils/request';

//获取号码库列表
export async function getList(params) {
  return request('/api/Mobile/MobileList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加号码库
export async function addRule(params) {
  return request('/api/Mobile/AddMobile', {
    method: 'POST',
    data: { ...params },
  });
}

//修改号码库
export async function ModifySysRole(params) {
  return request('/api/Mobile/ModifyMobile', {
    method: 'POST',
    data: { ...params },
  });
}

//删除号码库
export async function removeRule(params) {
  return request('/api/Mobile/DeleteMobile', {
    method: 'POST',
    data: { ...params },
  });
}

//号码库导入
export async function ImportMobile(params) {
  return request('/api/Mobile/ImportMobile', {
    method: 'POST',
    data: { ...params },
  });
}

//号码库导出
export async function ExportMobile(params) {
  return request('/api/Mobile/ExportMobile', {
    method: 'POST',
    data: { ...params },
  });
}

//号码批次接口
export async function LotMobile(params) {
  return request('/api/Mobile/MobileBatchNoList', {
    method: 'POST',
    data: { ...params },
  });
}

//单个号码库
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}

//号码库导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}

//禁用 启用
export async function enableAccounts(params) {
  return request('/role/enable', {
    method: 'POST',
    data: { ...params },
  });
}
