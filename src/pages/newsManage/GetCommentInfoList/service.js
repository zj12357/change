import request from '@/utils/request';


//获取资讯评论列表
export async function getList(params) {
  return request('/api/News/GetCommentInfoList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加资讯评论
export async function addRule(params) {
  return request('/api/Video/AddVideoComment', {
    method: 'POST',
    data: { ...params },
  });
}


//修改资讯评论
export async function ModifySysRole(params) {
  return request('/api/Video/ModifyVideoComment', {
    method: 'POST',
    data: { ...params },
  });
}


//删除资讯评论
export async function removeRule(params) {
  return request('/api/News/DeleteCommentInfo', {params});
}

//单个资讯评论
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//资讯评论导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}


//禁用 启用
export async function enableAccounts(params) {
  // return request('/api/News/ModifyCommentInfo', {params});
  return request('/api/News/ModifyCommentInfo', {
    method: 'POST',
    data: { ...params },
  });
}

export async function ReferralsVideoComment(params) {
  // return request('/api/News/ModifyCommentInfoByIsReferrals', {params});
  return request('/api/News/ModifyCommentInfoByIsReferrals', {
    method: 'POST',
    data: { ...params },
  });
}
