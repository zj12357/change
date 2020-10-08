import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { keysID, listId, menuText } from './../keys';
import router from 'umi/router';
import { filtEleBtn, takeIcon } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};


@connect(({ loading, login }) => ({
  login,
  submitting: loading.effects['feedbackListModel/update'],
}))

class UpdateForm extends Component {




  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values = {},
      handleUpdate,
      submitting
    } = this.props;

    return (
      <Modal
        width={550}
        bodyStyle={{
          padding: '32px 20px 48px',
        }}
        destroyOnClose
        title="落地页详情添加"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={() => handleUpdateModalVisible(false)}
        confirmLoading={submitting}
        maskClosable={false}
      >

        <FormItem {...formItemLayout} label="新增广告图">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.LandingAddMore) ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/AdvertisingList?lpid=${values.lpid}`)}
            >
              前往添加
            </Button>
          ) : '暂无权限'}
        </FormItem>

        <FormItem {...formItemLayout} label="新增落地页公告">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.LandingAddMore) ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/NoticeList?lpid=${values.lpid}`)}
            >
              前往添加
            </Button>
          ) : '暂无权限'}
        </FormItem>

        <FormItem {...formItemLayout} label="新增背景图">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.LandingAddMore) ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/BackgroundList?lpid=${values.lpid}`)}
            >
              前往添加
            </Button>
          ) : '暂无权限'}
        </FormItem>

        <FormItem {...formItemLayout} label="新增轮播图">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.LandingAddMore) ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/BannerList?lpid=${values.lpid}`)}
            >
              前往添加
            </Button>
          ) : '暂无权限'}
        </FormItem>

        <FormItem {...formItemLayout} label="新增客服链接">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.LandingAddMore) ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/CustomerList?lpid=${values.lpid}`)}
            >
              前往添加
            </Button>
          ) : '暂无权限'}
        </FormItem>

        <FormItem {...formItemLayout} label="新增落地页域名信息">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.LandingAddMore) ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/LandingDomainList?lpid=${values.lpid}`)}
            >
              前往添加
            </Button>
          ) : '暂无权限'}
        </FormItem>

        <FormItem {...formItemLayout} label="活动关联列表">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.LandingAddMore) ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/landingRelationActivity?ldid=${values.lpid}`)}
            >
              前往查看
            </Button>
          ) : '暂无权限'}
        </FormItem>

        {/* <FormItem {...formItemLayout} label="新增落地页域名绑定">
          {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新增落地页域名绑定') ? (
            <Button
              // icon="plus"
              type="primary"
              onClick={() => router.push(`/LandingPage/AddLandingPageDomain?lpid=${values.lpid}`)}
            >
              前往添加
            </Button>
          ) : '暂无权限'}
        </FormItem> */}


      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
