import request from '@/utils/request';


//获取聊天室用户列表
export async function getList(params) {
  return request('/api/TencentIM/SearchIMGroupMemberRequest', {
    method: 'POST',
    data: { ...params },
  });
}

//获取聊天室详情
export async function GetChatroomInfoById(params) {
  return request('/api/ChatRoom/GetChatroomInfoById',{params});
}


//创建用户
export async function addRule(params) {
  return request('/api/ChatRoom/RegisterUser', {
    method: 'POST',
    data: { ...params },
  });
}

//聊天室发系统消息
export async function AddMembers(params) {
  return request('/api/TencentIM/SendSystemMsgRequest', {
    method: 'POST',
    data: { ...params },
  });
}



//修改聊天室用户
export async function ModifySysRole(params) {
  return request('/api/News/ModifyNewsType', {
    method: 'POST',
    data: { ...params },
  });
}


//删除聊天室用户
export async function removeRule(params) {
  return request('/api/TencentIM/DeleteGroupMember', {
    method: 'POST',
    data: { ...params },
  });
}

//聊天室用户 禁言
export async function UpdateUserForbiddenStatus(params) {
  return request('/api/TencentIM/ShutUpTimeMember', {
    method: 'POST',
    data: { ...params },
  });
}

//单个聊天室用户
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}

//获取添加用户列表
export async function GetUserInfoList(params) {
  return request('/api/User/GetUserInfoList', {
    method: 'POST',
    data: { ...params },
  });
}



//聊天室用户导航
export async function SysNavigationList(params) {
  return request('/api/SysMenu/SysNavigationList', {
    method: 'POST',
    data: { ...params },
  });
}


//禁用 启用
export async function enableAccounts(params) {
  return request('/api/TencentIM/ShutUpTimeMember',{
    method: 'POST',
    data: { ...params },
  });
}
