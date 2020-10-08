import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';
import { flatArrs, stringTurnArr } from '@/utils/utils.js';

const FormItem = Form.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
// const  cutList = [
//   {
//     "id": 145,
//     "code": "Add",
//     "displayName": "新建",
//     "iconPath": "add",
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "1753-January-1 0:0:0",
//     "children": null
//   },
//   {
//     "id": 146,
//     "code": "Delete",
//     "displayName": "删除",
//     "iconPath": "delete",
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "1753-January-1 0:0:0",
//     "children": null
//   },
//   {
//     "id": 148,
//     "code": "QueryList",
//     "displayName": "查询",
//     "iconPath": "",
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:40:23",
//     "children": null
//   },
//   {
//     "id": 149,
//     "code": "Edit",
//     "displayName": "编辑",
//     "iconPath": "",
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "1753-January-1 0:0:0",
//     "children": null
//   },
//   {
//     "id": 150,
//     "code": "DistributionRole",
//     "displayName": "分配角色",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:40:56",
//     "children": null
//   },
//   {
//     "id": 151,
//     "code": "Frozen",
//     "displayName": "冻结用户",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:41:3",
//     "children": null
//   },
//   {
//     "id": 152,
//     "code": "EditPassword",
//     "displayName": "修改密码",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:41:11",
//     "children": null
//   },
//   {
//     "id": 153,
//     "code": "PermissionConfiguration",
//     "displayName": "权限配置",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:41:19",
//     "children": null
//   },
//   {
//     "id": 154,
//     "code": "BindUser",
//     "displayName": "绑定用户",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "1753-January-1 0:0:0",
//     "children": null
//   },
//   {
//     "id": 155,
//     "code": "DistributionDomain",
//     "displayName": "分配域名",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:41:34",
//     "children": null
//   },
//   {
//     "id": 156,
//     "code": "BindingCollector",
//     "displayName": "绑定采集器",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:41:42",
//     "children": null
//   },
//   {
//     "id": 157,
//     "code": "SignIn",
//     "displayName": "登录",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:41:49",
//     "children": null
//   },
//   {
//     "id": 158,
//     "code": "BindingMatch",
//     "displayName": "绑定赛事",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:41:57",
//     "children": null
//   },
//   {
//     "id": 159,
//     "code": "Unbind",
//     "displayName": "取消绑定",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:42:7",
//     "children": null
//   },
//   {
//     "id": 160,
//     "code": "UpdateForecastResults",
//     "displayName": "更新预测结果",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:42:24",
//     "children": null
//   },
//   {
//     "id": 161,
//     "code": "ChatRoomManage",
//     "displayName": "聊天室管理",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:42:32",
//     "children": null
//   },
//   {
//     "id": 162,
//     "code": "ViewForecast",
//     "displayName": "查看预测",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:42:41",
//     "children": null
//   },
//   {
//     "id": 163,
//     "code": "ViewIntelligence",
//     "displayName": "查看情报",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:42:50",
//     "children": null
//   },
//   {
//     "id": 164,
//     "code": "ViewOdds",
//     "displayName": "查看赔率",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:43:8",
//     "children": null
//   },
//   {
//     "id": 165,
//     "code": "PushAppointMessage",
//     "displayName": "推送指定用户",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:43:16",
//     "children": null
//   },
//   {
//     "id": 166,
//     "code": "PushAllMessage",
//     "displayName": "推送所有用户消息",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:43:24",
//     "children": null
//   },
//   {
//     "id": 167,
//     "code": "PushMessage",
//     "displayName": "推送消息",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:43:32",
//     "children": null
//   },
//   {
//     "id": 168,
//     "code": "UndoPush",
//     "displayName": "撤销推送",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:43:39",
//     "children": null
//   },
//   {
//     "id": 169,
//     "code": "AuditDisplay",
//     "displayName": "审核显示",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:43:47",
//     "children": null
//   },
//   {
//     "id": 170,
//     "code": "RecommendedComments",
//     "displayName": "推荐评论",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:43:56",
//     "children": null
//   },
//   {
//     "id": 171,
//     "code": "Details",
//     "displayName": "详情",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:44:7",
//     "children": null
//   },
//   {
//     "id": 172,
//     "code": "Reply",
//     "displayName": "回复",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:44:16",
//     "children": null
//   },
//   {
//     "id": 173,
//     "code": "FreezeUnfreezeUsers",
//     "displayName": "冻结解冻用户",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:44:26",
//     "children": null
//   },
//   {
//     "id": 174,
//     "code": "ResetPassword",
//     "displayName": "重置密码",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:44:33",
//     "children": null
//   },
//   {
//     "id": 175,
//     "code": "IMManage",
//     "displayName": "IM管理",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:44:43",
//     "children": null
//   },
//   {
//     "id": 176,
//     "code": "LandingAddMore",
//     "displayName": "落地页添加更多",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:44:51",
//     "children": null
//   },
//   {
//     "id": 177,
//     "code": "ViewScreenshot",
//     "displayName": "查看截图",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:44:58",
//     "children": null
//   },
//   {
//     "id": 178,
//     "code": "AuditActivities",
//     "displayName": "审核活动",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:45:6",
//     "children": null
//   },
//   {
//     "id": 179,
//     "code": "ImportMobile",
//     "displayName": "导入号码库",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:45:17",
//     "children": null
//   },
//   {
//     "id": 180,
//     "code": "ExportMobile",
//     "displayName": "导出号码库",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": null,
//     "createTime": "2020-August-14 22:45:26",
//     "children": null
//   },
//   {
//     "id": 181,
//     "code": "ResetCache",
//     "displayName": "重置字典缓存",
//     "iconPath": null,
//     "sort": 0,
//     "disabled": "0",
//     "parentCode": "MenuButtonList",
//     "parentDisplayName": "菜单按钮权限",
//     "remark": "",
//     "createTime": "1753-January-1 0:0:0",
//     "children": null
//   }
// ]

@connect(({ systemMenuModel, loading }) => ({
  systemMenuModel,
  submitting: loading.effects['systemMenuModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //菜单列表
    sysPermissionList: [], //权限列表
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    // dispatch({
    //   type: 'systemMenuModel/fetch',
    //   payload: {
    //     pageIndex: 1,
    //     pageSize: 500,
    //   },
    //   callback: (data) => {
    //     const { sysMenuList = [] } = data;
    //     this.setState({ sysMenuList })
    //   }
    // });

    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showType: 3,
        showDisabled: true,
        parentCode: 'MenuButtonList',
      },
      callback: (data = {}) => {
        this.setState({ sysPermissionList: data.dictionaryList || [] });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    const { sysPermissionList = [] } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };

      const buttonList = Array.isArray(value.buttonList) ? value.buttonList : [];
      if (buttonList.length > 0) {
        const codeArr = sysPermissionList.map(item => item.code);
        const nameArr = buttonList.map(item => {
          return sysPermissionList[codeArr.indexOf(item)].displayName;
        });
        value.buttonList = buttonList.join(',');
        value.buttonListName = nameArr.join(',');
      } else {
        value.buttonList = '';
        value.buttonListName = '';
      }

      //清除父级菜单
      // value.parentCode = null;

      // form.resetFields();
      handleAdd(value);
    });
  };
  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      systemMenuModel: { data },
      submitting,
    } = this.props;
    const { isEditName, sysMenuList = [], sysPermissionList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}菜单`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={700}
      >
        <FormItem {...formItemLayout} label="菜单名称">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入菜单名称！',
              },
            ],
            initialValue: editRoleDate.name,
          })(<Input placeholder="请输入菜单名称" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="菜单路径">
          {form.getFieldDecorator('menuUrl', {
            rules: [
              {
                required: true,
                message: '请输入菜单路径！',
              },
            ],
            initialValue: editRoleDate.menuUrl,
          })(<Input placeholder="请输入菜单路径" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="菜单代码">
          {form.getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入菜单代码！',
              },
            ],
            initialValue: editRoleDate.code,
          })(<Input placeholder="请输入菜单代码" />)}
        </FormItem>

        {/* <FormItem {...formItemLayout} label="父级菜单">
          {form.getFieldDecorator('parentCode', {
            rules: [
              {
                required: false,
                message: '请输入父级菜单！',
              },
            ],
            initialValue: editRoleDate.parentCode,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请输入父级菜单！">
              {sysMenuList.map(item => {
                return (
                  <Option value={item.code} key={item.code}>{item.name}</Option>
                )
              })
              }
            </Select>

            // <Input placeholder="请输入父级菜单！" />
          )}
        </FormItem> */}

        <FormItem {...formItemLayout} label="按钮权限">
          {form.getFieldDecorator('buttonList', {
            rules: [
              {
                required: false,
                message: '请选择权限编号',
              },
            ],
            initialValue: stringTurnArr(editRoleDate.buttonList),
          })(
            <Select
              style={{ width: '100%' }}
              mode="multiple"
              placeholder="请选择权限！"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysPermissionList.map(item => {
                return (
                  <Option value={item.code} key={item.code}>
                    {item.displayName}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="菜单备注">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入菜单备注！',
              },
              {
                max: 50,
                message: '最大不超过50个字符！',
              },
            ],
            initialValue: editRoleDate.remark,
          })(<Input placeholder="请输入菜单备注" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="菜单排序">
          {form.getFieldDecorator('order', {
            rules: [
              {
                required: false,
                message: '请输入菜单排序！',
              },
            ],
            initialValue: editRoleDate.order,
          })(<InputNumber min={1} placeholder="请输入菜单排序" style={{ width: '100%' }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="是否显示">
          {form.getFieldDecorator('isShow', {
            rules: [
              {
                required: false,
                message: '请选择是否显示！',
              },
            ],
            initialValue: editRoleDate.isShow,
          })(
            <Radio.Group>
              <Radio value={true}>启用</Radio>
              <Radio value={false}>禁用</Radio>
            </Radio.Group>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="图标">
          {form.getFieldDecorator('icon', {
            rules: [
              {
                required: false,
                message: '请输入图标！',
              },
            ],
            initialValue: editRoleDate.icon,
          })(
            // <div>
            <Input placeholder="请输入图标(例：setting)" />,
            // <a href="https://3x.ant.design/components/icon-cn/" target='_blank'>前往图标库</a>
            // </div>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
