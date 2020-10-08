import request from '@/utils/request';

//获取数据渠道列表
export async function getList(params) {
  return request('/api/Mobile/ChannelSourceList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加数据渠道列表
export async function addRule(params) {
  return request('/api/Mobile/AddChannelSource', {
    method: 'POST',
    data: { ...params },
  });
}

//修改数据渠道列表
export async function ModifySysRole(params) {
  return request('/api/Mobile/ModifyChannelSource', {
    method: 'POST',
    data: { ...params },
  });
}

//删除数据渠道列表
export async function removeRule(params) {
  return request('/api/Mobile/DeleteChannelSource', {
    method: 'POST',
    data: { ...params },
  });
}
