import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps, message, Spin } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const { TreeNode } = Tree;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ loading }) => ({
  submitting: loading.effects['agentLineModel/GetAgetnLogins'],
  loadingCard: loading.effects['agentLineModel/GetVerifyingModels'],
}))
class UpdataCookie extends Component {
  static defaultProps = {
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isValidate: false,
      data: {},
      sysUserList: [],
    };
  }

  componentDidMount() {
    const { dispatch, value } = this.props;
    const _this = this;
    dispatch({
      type: 'agentLineModel/ProxyCollectionActiveDomainLists',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        plid: value.plid,
      },
      callback: data => {
        const { collectionDomainList = [] } = data;
        this.setState({ sysUserList: collectionDomainList });
      },
    });
  }

  validateJiYan = (data, fieldsValue = {}) => {
    const { value = {}, handleUpdateCookieModel, dispatch } = this.props;
    dispatch({
      type: 'agentLineModel/GetAgetnLogins',
      payload: {
        cdid: fieldsValue.cdid,
        name: value.name,
        geetest_challenge: data.geetest_challenge,
        geetest_validate: data.geetest_validate,
        geetest_seccode: data.geetest_seccode,
        check: 'new',
        session_id: data.session_id,
      },
      callback: () => {
        message.success('更新成功');
        handleUpdateCookieModel(false);
      },
    });

    dispatch({
      type: 'agentLineModel/ProxyLoginDomains',
      payload: {
        plid: value.plid,
        cdid: fieldsValue.cdid,
        cookie: value.cookie,
        token: value.token,
      },
      callback: () => {},
    });
  };

  okHandle = () => {
    const { form, handleUpdate, value } = this.props;
    const { isValidate, data = {} } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!isValidate) {
        message.error('请先完成验证！');
        return false;
      }
      // form.resetFields();
      // handleUpdate(value)
      this.validateJiYan(data, fieldsValue);
    });
  };

  cdidOnchange = e => {
    const { dispatch, value } = this.props;
    const _this = this;
    dispatch({
      type: 'agentLineModel/GetVerifyingModels',
      payload: {
        cdId: e,
      },
      callback: data => {
        console.log(data);
        //请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
        initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'popup',
          },
          function(captchaObj) {
            //防止重复追加
            const isHascaptchaObj = document.getElementById('captchaBox').firstChild;
            if (isHascaptchaObj) {
              document.getElementById('captchaBox').removeChild(isHascaptchaObj);
            }
            // 这里可以调用验证实例 captchaObj 的实例方法
            //将验证按钮插入到宿主页面中captchaBox元素内
            captchaObj.appendTo('#captchaBox');
            captchaObj
              .onReady(function() {
                //加载就绪
              })
              .onSuccess(function() {
                const result = captchaObj.getValidate();
                _this.setState({
                  isValidate: true,
                  data: {
                    ...data,
                    ...result,
                  },
                });
              })
              .onError(function() {
                // message.error('加载失败，请关闭弹窗重新加载');
              });
          },
        );
      },
    });
  };

  render() {
    const {
      value,
      submitting,
      updataCookieStatus,
      handleUpdateCookieModel,
      form,
      loadingCard,
    } = this.props;
    const loadingCardIs = !!loadingCard ? true : false;
    const { proxyUserList = [], sysUserList = [] } = this.state;
    return (
      <Modal
        bodyStyle={{
          padding: '20px',
        }}
        destroyOnClose
        title={'登录'}
        visible={updataCookieStatus}
        onCancel={() => handleUpdateCookieModel(false)}
        afterClose={() => handleUpdateCookieModel(false)}
        onOk={this.okHandle}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <Spin tip="加载中..." spinning={loadingCardIs} delay={300}>
          <FormItem {...formItemLayout} label="名称">
            {form.getFieldDecorator('gt', {
              rules: [
                {
                  required: false,
                  message: '请输入！',
                },
              ],
              initialValue: value.name,
            })(<Input placeholder="请输入！" disabled />)}
          </FormItem>

          <FormItem {...formItemLayout} label="域名选择">
            {form.getFieldDecorator('cdid', {
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
              // initialValue: editRoleDate.cdid,
            })(
              <Select onChange={this.cdidOnchange} style={{ width: '100%' }} placeholder="请选择">
                {sysUserList.map(item => {
                  return (
                    <Option value={item.cdid} key={item.cdid}>
                      {item.domainName}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="验证">
            <div style={{ width: '200px', height: '50px' }} id="captchaBox"></div>
          </FormItem>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(UpdataCookie);
