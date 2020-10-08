import { Form, Input, InputNumber, Modal, Radio, Select, Spin } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import debounce from 'lodash/debounce';
import { keysID, listId } from '../keys.js';

import UploadImg from '@/components/Upload/UploadImg.jsx';
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

@connect(({ sportInformationListModel, loading }) => ({
  sportInformationListModel,
  submitting: loading.effects['sportInformationListModel/add'],
  searchUserLoading: loading.effects['matchListModel/fetch'],
  searchTeamLoading: loading.effects['teamListModel/fetch'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 盘口信息列表
    teamList: [],
    isEditName: '新增',
  };

  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
  }

  getSerachUser = name => {
    if (!name) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'matchListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ sysMenuList: data.list || [] });
      },
    });
  };

  getSerachTeamList = name => {
    if (!name) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'teamListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ teamList: data.list || [] });
      },
    });
  };

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = { ...editRoleDate, ...fieldsValue };

      // console.log('fieldsValue', value)
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
      sportInformationListModel: { data },
      submitting,
      searchUserLoading,
      searchTeamLoading,
    } = this.props;
    const { isEditName, sysMenuList = [], teamList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}情报`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout} label="赛事编号">
          {form.getFieldDecorator('competitionById', {
            rules: [
              {
                required: true,
                message: '请输入赛事编号！',
              },
            ],
            initialValue: editRoleDate.competitionById,
          })(
            <Select
              style={{ width: '100%' }}
              showSearch
              showArrow={false} // 是否显示下拉小箭头
              notFoundContent={searchUserLoading ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={debounce(this.getSerachUser, 1000)}
              placeholder="请输入赛事名称搜索赛事"
              loading={searchUserLoading}
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysMenuList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="情报内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入情报内容！',
              },
            ],
            initialValue: editRoleDate.content,
          })(<Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入情报内容" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="情报来源">
          {form.getFieldDecorator('source', {
            rules: [
              {
                required: false,
                message: '请输入情报来源！',
              },
            ],
            initialValue: editRoleDate.source,
          })(<Input placeholder="请输入情报来源" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="情报分类">
          {form.getFieldDecorator('type', {
            rules: [
              {
                required: false,
                message: '请输入情报分类！',
              },
            ],
            initialValue: editRoleDate.type,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择情报分类"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              <Option value={'有利情报'}>有利情报</Option>
              <Option value={'中立情报'}>中立情报</Option>
              <Option value={'不利情报'}>不利情报</Option>
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="球队编号">
          {form.getFieldDecorator('leagueTeamById', {
            rules: [
              {
                required: false,
                message: '请输入球队编号！',
              },
            ],
            initialValue: editRoleDate.leagueTeamById,
          })(
            <Select
              style={{ width: '100%' }}
              notFoundContent={searchTeamLoading ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              showArrow={false} // 是否显示下拉小箭头
              onSearch={debounce(this.getSerachTeamList, 1000)}
              placeholder="请输入球队名称搜索球队"
              loading={searchTeamLoading}
              defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {teamList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="球队名称">
          {form.getFieldDecorator('teamName', {
            rules: [
              {
                required: false,
                message: '请输入球队名称！',
              },
            ],
            initialValue: editRoleDate.teamName,
          })(<Input placeholder="请输入球队名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="球队logo">
          {form.getFieldDecorator('logo', {
            rules: [
              {
                required: false,
                message: '请输入球队logo！',
              },
            ],
            initialValue: editRoleDate.logo,
          })(<UploadImg />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
