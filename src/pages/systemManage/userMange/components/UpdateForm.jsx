import { Button, DatePicker, Form, Input, Modal, Radio, Select, Steps, TreeSelect } from 'antd';
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
  submitting: loading.effects['userMangeModel/update'],
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
    // console.log('values',values)
    dispatch({
      type: 'roleListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        const { sysRoleList = [] } = data;
        this.setState({ sysMenuList: sysRoleList });
      },
    });

    dispatch({
      type: 'userMangeModel/SysUserRoleLists',
      payload: {
        userID: values.userID,
      },
      callback: data => {
        const { sysUserRoleList = [] } = data;
        let list = sysUserRoleList.map(item => {
          return item.code;
        });
        this.setState({ sysUserList: list });
      },
    });
  }

  okHandle = () => {
    const { form, handleUpdate, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let sysUserRoleDetailParam = fieldsValue.sysUserRoleDetailParam;

      sysUserRoleDetailParam = sysUserRoleDetailParam.map(item => {
        return { roleCode: item };
      });

      // form.resetFields();

      handleUpdate({ userName: values.userName, sysUserRoleDetailParam });
    });
  };

  getChildren = data => {
    return data.map(item => {
      return {
        title: item.name,
        key: item.id,
        value: item.code,
        children:
          item.children == null || item.children.length <= 0 ? [] : this.getChildren(item.children),
      };
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
        title="分配角色"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={this.okHandle}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout} label="角色">
          {form.getFieldDecorator('sysUserRoleDetailParam', {
            rules: [
              {
                required: false,
                message: '请选择角色',
              },
            ],
            initialValue: sysUserList || [],
          })(
            <TreeSelect
              style={{ width: '100%' }}
              mode="multiple"
              allowClear
              placeholder="请选择角色"
              treeData={this.getChildren(sysMenuList)}
              multiple
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            ></TreeSelect>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
