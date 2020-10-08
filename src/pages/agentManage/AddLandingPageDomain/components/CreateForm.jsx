import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker } from 'antd';
import React, { Component } from 'react';




import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

import moment from 'moment'

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




@connect(({ AddLandingPageDomainModel, loading }) => ({
  AddLandingPageDomainModel,
  submitting: loading.effects['AddLandingPageDomainModel/add'],
}))


class CreateForm extends Component {
  state = {
    sysMenuList: [], //系统公告列表
    modeList: [],
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
      
    }
    if(editRoleDate.lpid){
      this.ldOnChange(editRoleDate.lpid);
    }
   
    dispatch({
      type: 'LandingPageListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: (data) => {
        const { landingPageList = [] } = data;
        this.setState({ sysMenuList: landingPageList })
      }
    });


  }

  ldOnChange = e => {
    const { dispatch, editRoleDate = {} } = this.props;
    dispatch({
      type: 'LandingDomainListModel/fetch',
      payload: {
        lpid:Number(e),
        pageIndex: 1,
        pageSize: 300,
      },
      callback: (data) => {
        const list = data.landingDomainList || [];
        this.setState({ modeList:list })
      }
    });
  }


  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...editRoleDate, ...fieldsValue };

      // form.resetFields();
      handleAdd(value);


    });
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, AddLandingPageDomainModel: { data }, submitting } = this.props;
    const { isEditName, sysMenuList = [], modeList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}落地页域名绑定`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={650}
      >


        <FormItem {...formItemLayout} label="落地页">
          {form.getFieldDecorator('lpid', {
            rules: [
              {
                required: true,
                message: '请选择落地页',
              },
            ],
            initialValue: editRoleDate.lpid,
          })(
            <Select
              style={{ width: '100%' }}
              onChange={this.ldOnChange}
              placeholder="请选择落地页">
              {sysMenuList.map(item => {
                return (
                  <Option value={item.lpid} key={item.lpid}>{item.name}</Option>
                )
              })
              }
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="落地页域名信息">
          {form.getFieldDecorator('ldid', {
            rules: [
              {
                required: true,
                message: '请选择落地页域名信息',
              },
            ],
            initialValue: editRoleDate.ldid,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请先选择落地页查询域名">
              {modeList.map(item => {
                return (
                  <Option value={item.ldid} key={item.ldid}>{item.domainName}</Option>
                )
              })
              }
            </Select>,
          )}
        </FormItem>





      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
