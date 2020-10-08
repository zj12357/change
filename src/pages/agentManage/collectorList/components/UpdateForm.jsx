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

@connect(({ loading }) => ({
  submitting: loading.effects['collectorListModel/update'],
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
      autoExpandParent: true, //是否自动展开父节点
      checkedKeys: [], //选中列表
      selectedKeys: [],
      expandedKeys: [],
      sysMenuList: [],
      sysUserList: [],
    };
  }

  componentDidMount() {
    const { dispatch, values } = this.props;
    const { pcid, collectTypeID } = values;
    // console.log('values',values)
    dispatch({
      type: 'collectorpDomainModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { collectionDomainList = [] } = data;
        this.setState({ sysMenuList: collectionDomainList });
      },
    });

    dispatch({
      type: 'collectorpDomainModel/SysUserRoleLists',
      payload: {
        pcid,
        collectTypeID,
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { proxyCollectionDomainList = [] } = data;
        let list = proxyCollectionDomainList.map(item => {
          return item.cdid;
        });
        this.setState({ sysUserList: list });
      },
    });
  }

  okHandle = () => {
    const { form, handleUpdate, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { pcid, collectTypeID } = values;

      fieldsValue.proxyCollectionDomainDetailParam = fieldsValue.proxyCollectionDomainDetailParam.map(
        item => {
          return { cdid: item };
        },
      );

      // form.resetFields();

      handleUpdate({ ...fieldsValue, pcid, collectTypeID });
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
    } = this.props;
    const { currentStep, formVals, checkedKeys, sysUserList = [], sysMenuList } = this.state;

    return (
      <Modal
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="域名分配"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={this.okHandle}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout} label="域名">
          {form.getFieldDecorator('proxyCollectionDomainDetailParam', {
            rules: [
              {
                required: false,
                message: '请选择域名',
              },
            ],
            initialValue: sysUserList || [],
          })(
            <Select
              style={{ width: '100%' }}
              mode="multiple"
              mode="multiple"
              placeholder="请选择域名"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {sysMenuList.map(item => {
                return (
                  <Option value={item.cdid} key={item.cdid}>
                    {item.domainName}
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
