import request from '@/utils/request';

//获取号码运营商
export async function getList(params) {
  return request('/api/Mobile/MobileSupplyList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加号码运营商
export async function addMobile(params) {
  return request('/api/Mobile/AddMobileSupply', {
    method: 'POST',
    data: { ...params },
  });
}

//删除号码运营商
export async function removeMobile(params) {
  return request('/api/Mobile/DeleteMobileSupply', {
    method: 'POST',
    data: { ...params },
  });
}
