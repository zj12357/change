import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Steps,
  InputNumber,
  Tree,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

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
  submitting: loading.effects['ApplyListModel/update'],
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
      autoExpandParent: true, // 是否自动展开父节点
      checkedKeys: [], // 选中列表
      selectedKeys: [],
      expandedKeys: [],
      ActivityReviewStatus: [],
    };
  }

  componentDidMount() {
    this.getStatusList();
  }
  getStatusList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showDisabled: true,
        showType: 3,
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let ActivityReviewStatus = list.filter(item => item.parentCode === 'ActivityReviewStatus');
        this.setState({ ActivityReviewStatus });
      },
    });
  };

  okHandle = () => {
    const { form, handleUpdate, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { aid } = values;
      // form.resetFields();

      handleUpdate({ ...fieldsValue, aid });
    });
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values, submitting, form } = this.props;
    const { ActivityReviewStatus = [] } = this.state;
    return (
      <Modal
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="审核活动"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={this.okHandle}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <FormItem {...formItemLayout} label="审核状态">
          {form.getFieldDecorator('stateID', {
            rules: [
              {
                required: true,
                message: '请选择审核状态',
              },
            ],
            initialValue: values.stateID,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择审核状态"
              getPopupContainer={triggerNode => {
                return triggerNode.parentNode || document.body;
              }}
            >
              {ActivityReviewStatus.map((item, index) => (
                <Option value={item.code} key={index}>
                  {item.displayName}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="金额">
          {form.getFieldDecorator('applyAmt', {
            rules: [
              {
                required: false,
                message: '请输入金额！',
              },
            ],
          })(<InputNumber placeholder="请输入金额" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="备注信息">
          {form.getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '请输入备注信息！',
              },
            ],
          })(<Input placeholder="请输入备注信息" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
