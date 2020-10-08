import request from '@/utils/request';
// GET /index/statistics

/**订单统计 */
export async function statistics(type) {
  return request(`/advisory/${type}`);
}
/**收入统计 */
export async function statisticsEarn(type) {
  return request(`/earnings/${type}`);
}
/**收入排行榜  */
export async function quarter(params) {
  return request(`/quarter`,{params});
}
