import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps } from 'antd';
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

//  userAssignment (用户分配)  landingPageDomain (落地页域名分配)  ProxyCollectionLine(采集器分配)
const typeName = {
  userAssignment: '代理线用户',
  landingPageDomain: '落地页域名',
  ProxyCollectionLine: '采集器',
};

@connect(({ loading }) => ({
  submitting: loading.effects['agentLineModel/update'],
}))
class UpdateForm extends Component {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      sysUserList: [],
      proxyUserList: [],
    };
  }

  componentDidMount() {
    /**
     *  type:'',// userAssignment (用户分配)  landingPageDomain (落地页域名分配)  ProxyCollectionLine(采集器分配)
     */

    const { dispatch, values, type } = this.props;

    dispatch({
      type: 'agentLineModel/getNeedList',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        type,
      },
      callback: data => {
        const sysUserList =
          data.sysUserList || data.landingDomainList || data.proxyCollectionList || [];
        this.setState({ sysUserList });
      },
    });

    dispatch({
      type: 'agentLineModel/SysUserRoleLists',
      payload: {
        plid: values.plid,
        type,
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        let list =
          data.proxyUserList || data.landingPageDomainList || data.proxyCollectionLineList || [];
        list = list.map(item => {
          return item.userID || item.ldid || item.pcid;
        });

        this.setState({ proxyUserList: list });
      },
    });
  }

  okHandle = () => {
    const { form, handleUpdate, values, type } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let value = { ...fieldsValue, plid: values.plid, type };
      let proxyUserDetailParam = fieldsValue.proxyUserDetailParam;

      if (type === 'userAssignment') {
        value.proxyUserDetailParam = proxyUserDetailParam.map(item => {
          return { userID: item };
        });
      }

      if (type === 'landingPageDomain') {
        value.landingPageDomainDetailParam = proxyUserDetailParam.map(item => {
          return { ldid: item };
        });
      }

      if (type === 'ProxyCollectionLine') {
        value.proxyCollectionLineDetailParam = proxyUserDetailParam.map(item => {
          return { pcid: item };
        });
      }

      // form.resetFields();

      handleUpdate(value);
    });
  };

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values,
      handleUpdate,
      submitting,
      form,
      type,
    } = this.props;
    const { proxyUserList = [], sysUserList = [] } = this.state;

    return (
      <Modal
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title={typeName[type] + '分配'}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={this.okHandle}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout} label={typeName[type]}>
          {form.getFieldDecorator('proxyUserDetailParam', {
            rules: [
              {
                required: false,
                message: '请选择',
              },
            ],
            initialValue: proxyUserList || [],
          })(
            <Select style={{ width: '100%' }} mode="multiple" allowClear placeholder="请选择">
              {sysUserList.map(item => {
                return (
                  <Option
                    value={item.userID || item.ldid || item.pcid}
                    key={item.userID || item.ldid || item.pcid}
                  >
                    {item.userName || item.domainName || item.name}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
