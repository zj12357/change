import { Tree, Form, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { genID } from '@/utils/utils.js';

const FormItem = Form.Item;
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
class LandingPageDomain extends Component {
  static defaultProps = {
    handleUpdate: () => {},
    handlelandingModalVisibleRole: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      sysUserList: [],
      domainList: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
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
        const sysUserList = data.list || [];
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
        let list = data.landingPageDomainList || [];
        list = list.map(item => {
          return String(item.ldid);
        });

        this.setState({
          checkedKeys: list,
          expandedKeys: list,
        });
      },
    });
  }

  getDomainChecck = val => {
    this.setState({
      domainList: val,
      checkedKeys: val,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.landingDomainList) {
        return (
          <TreeNode
            title={item.lpName}
            key={item.lpid + '_'}
            dataRef={item}
            checkable={false}
            selectable={false}
          >
            {this.renderTreeNodes(item.landingDomainList)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.ldid} title={item.domainAddress} />;
    });

  okHandle = () => {
    const { form, handleUpdate, values, type } = this.props;
    const { domainList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let value = { ...fieldsValue, plid: values.plid, type };
      if (type === 'landingPageDomain') {
        value.landingPageDomainDetailParam = domainList.map(item => {
          return { ldid: Number(item) };
        });
      }
      handleUpdate(value);
    });
  };

  render() {
    const {
      updateModalVisible,
      handlelandingModalVisibleRole,
      values,
      submitting,
      form,
      type,
    } = this.props;
    const { sysUserList = [] } = this.state;
    return (
      <Modal
        bodyStyle={{
          padding: '30px',
          height: '500px',
          overflow: 'auto',
        }}
        destroyOnClose
        title={typeName[type] + '分配'}
        visible={updateModalVisible}
        onCancel={() => handlelandingModalVisibleRole(false, values)}
        afterClose={() => handlelandingModalVisibleRole()}
        onOk={this.okHandle}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout}>
          {form.getFieldDecorator('proxyUserDetailParam', {
            rules: [
              {
                required: false,
                message: '请选择',
              },
            ],
          })(
            <Tree
              checkable
              onCheck={this.getDomainChecck}
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {this.renderTreeNodes(sysUserList)}
            </Tree>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(LandingPageDomain);
