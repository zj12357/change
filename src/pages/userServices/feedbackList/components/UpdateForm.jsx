import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Steps,
  Card,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import moment from 'moment';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(({ loading }) => ({
  submitting: loading.effects['feedbackListModel/update'],
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
    };
  }

  componentDidMount() {}

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values = {},
      allResourcesList,
      yelResourcesList,
      handleUpdate,
      submitting,
    } = this.props;
    const { currentStep, formVals, checkedKeys } = this.state;

    // console.log(allResourcesList,yelResourcesList)
    return (
      <Modal
        width={700}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="反馈详情"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={() => handleUpdateModalVisible(false)}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <Card bordered={false}>
          <Descriptions title="详情信息" style={{ marginBottom: 32 }} column={2}>
            {/*<Descriptions.Item label="标题">{values.title}</Descriptions.Item>*/}
            <Descriptions.Item label="反馈内容">{values.content}</Descriptions.Item>
            <Descriptions.Item label="用户名">{values.userByName}</Descriptions.Item>
            <Descriptions.Item label="联系">{values.contact}</Descriptions.Item>

            <Descriptions.Item label="过程内容">{values.processContent}</Descriptions.Item>
            <Descriptions.Item label="管理员姓名">{values.adminByName}</Descriptions.Item>

            <Descriptions.Item label="创建时间">
              {values.createTime ? moment(values.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="处理结果">{values.processContent}</Descriptions.Item>
            <Descriptions.Item label="处理时间">
              {values.processdTime ? moment(values.processdTime).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
