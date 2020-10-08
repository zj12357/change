import request from '@/utils/request';


//获取视频评论列表
export async function getList(params) {
  return request('/api/Video/VideoCommentList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加视频评论
export async function addRule(params) {
  return request('/api/Video/AddVideoComment', {
    method: 'POST',
    data: { ...params },
  });
}


//修改视频评论
export async function ModifySysRole(params) {
  return request('/api/Video/ModifyVideoComment', {
    method: 'POST',
    data: { ...params },
  });
}


//删除视频评论
export async function removeRule(params) {
  return request('/api/Video/DeleteVideoComment', {
    method: 'POST',
    data: { ...params },
  });
}

//单个视频评论
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//视频评论导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}


//禁用 启用
export async function enableAccounts(params) {
  return request('/api/Video/ApproveVideoComment',{
    method: 'POST',
    data: { ...params },
  });
}

export async function ReferralsVideoComment(params) {
  return request('/api/Video/ReferralsVideoComment',{
    method: 'POST',
    data: { ...params },
  });
}
