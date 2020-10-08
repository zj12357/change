import request from '@/utils/request';


//获取聊天室列表
export async function getList(params) {
  return request('/api/ChatRoom/GetChatroomList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加聊天室
export async function addRule(params) {
  return request('/api/ChatRoom/CreateChatroom', {
    method: 'POST',
    data: { ...params },
  });
}


//修改聊天室
export async function ModifySysRole(params) {
  return request('/api/Video/ModifyVideoType', {
    method: 'POST',
    data: { ...params },
  });
}


//删除聊天室
export async function removeRule(params) {
  return request('/api/ChatRoom/DeleteChatroom',{params});
}

//创建用户
export async function RegisterUser(params) {
  return request('/api/ChatRoom/RegisterUser', {
    method: 'POST',
    data: { ...params },
  });
}


//创建管理员用户
export async function RegisterAdminUser(params) {
  return request('/api/ChatRoom/RegisterAdminUser', {params});
}



//单个聊天室
export async function GetBannerModel(params) {
  return request('/api/SysSettings/GetBannerModel', {
    method: 'POST',
    data: { ...params },
  });
}



//聊天室导航
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
