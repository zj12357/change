import request from '@/utils/request';

//获取号码分配列表
export async function getList(params) {
  return request('/api/Mobile/MobileAssignList', {
    method: 'POST',
    data: { ...params },
  });
}

//增加号码分配列表
export async function addRule(params) {
  return request('/api/Mobile/AddMobileAssign', {
    method: 'POST',
    data: { ...params },
  });
}

//修改号码分配列表
export async function ModifySysRole(params) {
  return request('/api/Mobile/ModifyMobileAssign', {
    method: 'POST',
    data: { ...params },
  });
}

//删除号码分配
export async function removeRule(params) {
  return request('/api/Mobile/DeleteMobileAssign', {
    method: 'POST',
    data: { ...params },
  });
}

//申请号码分配
export async function Apply(params) {
  return request('/api/Mobile/ApplyMobileAssign', {
    method: 'POST',
    data: { ...params },
  });
}

//撤销号码分配
export async function CancelApply(params) {
  return request('/api/Mobile/CancelMobileAssign', {
    method: 'POST',
    data: { ...params },
  });
}

//审核号码分配
export async function ConfirmApply(params) {
  return request('/api/Mobile/ConfirmMobileAssign', {
    method: 'POST',
    data: { ...params },
  });
}

//审核分配流程记录
export async function ApplyRecordList(params) {
  return request('/api/Mobile/AssignApplyRecordList', {
    method: 'POST',
    data: { ...params },
  });
}
