import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { genID } from '@/utils/utils.js';
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

import { Tree } from 'antd';

const { TreeNode } = Tree;

@connect(({ loading }) => ({
  submitting: loading.effects['roleListModel/update'],
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
      list: [],
    };
  }

  componentDidMount() {
    const { PermissionListData, dispatch } = this.props;

    dispatch({
      type: 'userMangeModel/PermissionListData',
      payload: { userID: PermissionListData.userID },
      callback: data => {
        this.setState({ list: data.sysUserPermissionList });
      },
    });
  }
  onExpand = expandedKeys => {
    // console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    // console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    // console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data => {
    if (Array.isArray(data) && data.length <= 0) {
      return <TreeNode key={genID()} title={'暂无权限分配'} />;
    }

    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.pName} key={genID()} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode key={genID()} title={item.pName} dataRef={item} />;
    });
  };

  render() {
    const {
      updateModalVisible,
      updataPermissionListStatus,
      PermissionListData,
      submitting,
    } = this.props;
    const { currentStep, formVals, checkedKeys, list } = this.state;

    return (
      <Modal
        width={750}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title={'权限分配列表'}
        visible={updateModalVisible}
        onCancel={() => updataPermissionListStatus()}
        afterClose={() => updataPermissionListStatus()}
        onOk={() => updataPermissionListStatus()}
        // confirmLoading={submitting}
        maskClosable={false}
      >
        <Tree
          defaultExpandAll={true} //默认展开所有树节点
          checkable //节点前添加 Checkbox 复选框
          disabled
          // onExpand={this.onExpand}                        //展开/收起节点时触发
          autoExpandParent={this.state.autoExpandParent} //是否自动展开父节点
          onCheck={this.onCheck} //点击复选框触发
          /**
        （受控）选中复选框的树节点（注意：父子节点有关联，
        如果传入父节点 key，则子节点自动选中；相应当子节点
         key 都传入，父节点也自动选中。当设置checkable和
         checkStrictly，它是一个有checked和halfChecked属性
         的对象，并且父子节点的选中与否不再关联 */
          checkedKeys={this.state.checkedKeys}
          // onSelect={this.onSelect}     //点击树节点触发
          selectedKeys={this.state.selectedKeys} //（受控）设置选中的树节点
        >
          {this.renderTreeNodes(list)}
        </Tree>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
