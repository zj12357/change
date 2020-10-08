import { Form, Input, InputNumber, Modal, Radio, Select, DatePicker, Col, Row } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import { keysID, listId } from './../keys.js';

import { flatArrs } from '@/utils/utils.js'

import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx'

import moment from 'moment'

const FormItem = Form.Item;

const { Option } = Select;



const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ agentLineModel, loading }) => ({
  agentLineModel,
  submitting: loading.effects['agentLineModel/add'],
}))


class CreateForm extends Component {
  state = {
    groupIDList: [], //代理线分组
    proxyTypeIDList: [],//代理类型
    proxyCollectionList: [],//采集器
    sysUserList: [],//用户列表
    isEditName: '新增',
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }

    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showType: 3,
        showDisabled: true,
      },
      callback: (data) => {
        const list = data.dictionaryList || [];
        //代理线分组
        const groupIDList = list.filter(item => item.parentCode === 'ProxyLineGroup');
        //代理类型
        const proxyTypeIDList = list.filter(item => item.parentCode === 'ProxyLineType');

        this.setState({ proxyTypeIDList, groupIDList })
      }
    });

    // dispatch({
    //   type: 'collectorListModel/fetch',
    //   payload: {
    //     pageIndex: 1,
    //     pageSize: 300,
    //   },
    //   callback: (data) => {
    //     const proxyCollectionList = data.proxyCollectionList || [];
    //     this.setState({ proxyCollectionList })
    //   }
    // });

    dispatch({
      type: 'userMangeModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: (data) => {
        const sysUserList = data.sysUserList || [];
        this.setState({ sysUserList })
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
    const { modalVisible, form, handleAdd, handleModalVisible, editRoleDate = {}, agentLineModel: { data }, submitting } = this.props;
    const { isEditName, groupIDList = [], proxyTypeIDList = [], proxyCollectionList = [], sysUserList = [] } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}代理线`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={1100}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="分组">
              {form.getFieldDecorator('groupID', {
                rules: [
                  {
                    required: false,
                    message: '请选择分组',
                  },
                ],
                initialValue: editRoleDate.groupID,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择分组">
                  {groupIDList.map(item => {
                    return (
                      <Option value={item.code} key={item.code}>{item.displayName}</Option>
                    )
                  })
                  }
                </Select>,
              )}
            </FormItem>


          </Col>
          <Col span={8}>

            <FormItem {...formItemLayout} label="代理线名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入代理线名称！',
                  },
                ],
                initialValue: editRoleDate.name,
              })(<Input placeholder="请输入代理线名称" />)}
            </FormItem>

          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="用户名">
              {form.getFieldDecorator('userName', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户名！',
                  },
                ],
                initialValue: editRoleDate.userName,
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>

          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="密码">
              {form.getFieldDecorator('password', {
                rules: [
                  {
                    required: false,
                    message: '请输入密码！',
                  },
                  {
                    min: 6,
                    message: '密码最少六个字符',
                  }
                ],
                initialValue: editRoleDate.password,
              })(<Input.Password placeholder="请输入密码" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="代理类型">
              {form.getFieldDecorator('proxyTypeID', {
                rules: [
                  {
                    required: false,
                    message: '请输入代理类型！',
                  },
                ],
                initialValue: editRoleDate.proxyTypeID,
              })(
                // <Input placeholder="请输入代理类型" />
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择代理类型">
                  {proxyTypeIDList.map(item => {
                    return (
                      <Option value={item.code} key={item.code}>{item.displayName}</Option>
                    )
                  })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="官方">
              {form.getFieldDecorator('officialCode', {
                rules: [
                  {
                    required: false,
                    message: '请输入官方！',
                  },
                ],
                initialValue: editRoleDate.officialCode,
              })(<Input placeholder="请输入官方" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="代理ID">
              {form.getFieldDecorator('proxyCode', {
                rules: [
                  {
                    required: false,
                    message: '请输入代理ID！',
                  },
                ],
                initialValue: editRoleDate.proxyCode,
              })(<Input placeholder="请输入代理ID" />)}
            </FormItem>

          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="真实姓名">
              {form.getFieldDecorator('realName', {
                rules: [
                  {
                    required: false,
                    message: '请输入真实姓名！',
                  },
                ],
                initialValue: editRoleDate.realName,
              })(<Input placeholder="请输入真实姓名" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="联系电话">
              {form.getFieldDecorator('phoneNo', {
                rules: [
                  {
                    required: false,
                    message: '请输入联系电话！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '联系电话格式错误！',
                  },
                ],
                initialValue: editRoleDate.phoneNo,
              })(<Input placeholder="请输入联系电话" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="邮箱">
              {form.getFieldDecorator('email', {
                rules: [
                  {
                    required: false,
                    message: '请输入邮箱！',
                  },
                  {
                    pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                    message: '邮箱号格式错误！',
                  },
                ],
                initialValue: editRoleDate.email,
              })(<Input placeholder="请输入邮箱" />)}
            </FormItem>

          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="支付密码">
              {form.getFieldDecorator('payPassword', {
                rules: [
                  {
                    required: false,
                    message: '请输入支付密码！',
                  },
                ],
                initialValue: editRoleDate.payPassword,
              })(<Input.Password placeholder="请输入支付密码" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="注册时间">
              {form.getFieldDecorator('registerTime', {
                rules: [
                  {
                    required: false,
                    message: '请输入注册时间！',
                  },
                ],
                initialValue: editRoleDate.registerTime,
              })(
                <CustomDatePicker />
              )}
            </FormItem>

          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="配置超时时间">
              {form.getFieldDecorator('timeout', {
                rules: [
                  {
                    required: false,
                    message: '请输入配置超时时间！',
                  },
                ],
                initialValue: editRoleDate.timeout,
              })(<InputNumber style={{ width: '100%' }} min={1} placeholder="请输入配置超时时间！" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="负责人">
              {form.getFieldDecorator('principalUserID', {
                rules: [
                  {
                    required: false,
                    message: '请选择负责人！',
                  },
                ],
                initialValue: editRoleDate.principalUserID,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择负责人！">
                  {sysUserList.map(item => {
                    return (
                      <Option value={item.userID} key={item.userID}>{item.userName}</Option>
                    )
                  })
                  }
                </Select>,
              )}
            </FormItem>

          </Col>
        </Row>







        {/* <FormItem {...formItemLayout} label="代理线Token">
          {form.getFieldDecorator('token', {
            rules: [
              {
                required: false,
                message: '请输入代理线Token！',
              },
            ],
            initialValue: editRoleDate.token,
          })(<Input.TextArea  placeholder="请输入代理线Token" />)}
        </FormItem>

         <FormItem {...formItemLayout} label="代理线Cookie">
          {form.getFieldDecorator('cookie', {
            rules: [
              {
                required: false,
                message: '请输入代理线Cookie！',
              },
            ],
            initialValue: editRoleDate.cookie,
          })(<Input.TextArea  placeholder="请输入代理线Cookie" />)}
        </FormItem> */}

        {/* <FormItem {...formItemLayout} label="采集器ID">
          {form.getFieldDecorator('pcid', {
            rules: [
              {
                required: false,
                message: '请选择采集器ID',
              },
            ],
            initialValue: editRoleDate.pcid || [],
          })(
              <Select
                mode="multiple"
                style={{ width:'100%' }}
                placeholder="请选择采集器ID">
                  {proxyCollectionList.map(item=>{
                    return (
                        <Option value={item.pcid} key={item.pcid}>{item.name}</Option>
                    )
                  })
                  }
              </Select>,
          )}
        </FormItem> */}








        {/* <FormItem {...formItemLayout} label="上级">
          {form.getFieldDecorator('parentID', {
            rules: [
              {
                required: false,
                message: '请输入上级！',
              },
            ],
            initialValue: editRoleDate.parentID,
          })(
            <Select
              style={{ width:'100%' }}
              placeholder="请选择上级">
                {sysUserList.map(item=>{
                  return (
                      <Option value={item.userID} key={item.userID}>{item.userName}</Option>
                  )
                })
                }
            </Select>,
          )}
        </FormItem> */}




      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
