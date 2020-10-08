import request from '@/utils/request';

//获取代理线登录域名列表
export async function getList(params) {
  return request('/api/Proxy/ProxyLoginDomainList', {
    method: 'POST',
    data: { ...params },
  });
}
