import request from '@/utils/request';

//获取号码归属地列表
export async function getList(params) {
  return request('/api/Mobile/MobileAttributeList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加号码归属地
export async function addMobile(params) {
  return request('/api/Mobile/AddMobileAttribute', {
    method: 'POST',
    data: { ...params },
  });
}

//删除号码归属地
export async function removeMobile(params) {
  return request('/api/Mobile/DeleteMobileAttributeSupply', {
    method: 'POST',
    data: { ...params },
  });
}

//号码归属地导入
export async function ImportMobile(params) {
  return request('/api/Mobile/ImportMobileAttribute', {
    method: 'POST',
    data: { ...params },
  });
}

//号码供应商列表
export async function MobileSupplyList(params) {
  return request('/api/Mobile/MobileSupplyList', {
    method: 'POST',
    data: { ...params },
  });
}
