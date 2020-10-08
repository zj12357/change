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
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

import moment from 'moment';
import { filtEleBtn, filterImages } from '@/utils/utils.js';

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
      autoExpandParent: true, //是否自动展开父节点
      checkedKeys: [], //选中列表
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
        width={750}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="用户详情"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        afterClose={() => handleUpdateModalVisible()}
        onOk={() => handleUpdateModalVisible(false)}
        confirmLoading={submitting}
        maskClosable={false}
      >
        <Card bordered={false}>
          <Descriptions title="详情信息" style={{ marginBottom: 32 }} column={2}>
            <Descriptions.Item label="用户名">{values.name}</Descriptions.Item>
            <Descriptions.Item label="手机">{values.mobile}</Descriptions.Item>
            <Descriptions.Item label="注册Ip">{values.ip}</Descriptions.Item>
            <Descriptions.Item label="别名">{values.alias}</Descriptions.Item>

            <Descriptions.Item label="图片">
              {values.img ? (
                <img src={filterImages(values.img)} alt="" style={{ width: '50px' }} />
              ) : (
                ''
              )}
            </Descriptions.Item>
            <Descriptions.Item label="地区">{values.region}</Descriptions.Item>
            {/* <Descriptions.Item label="用户区域">{values.userRegion}</Descriptions.Item> */}

            <Descriptions.Item label="性别">{values.gender ? '男' : '女'}</Descriptions.Item>
            <Descriptions.Item label="备注">{values.remark}</Descriptions.Item>
            <Descriptions.Item label=" 累计登陆次数">{values.logNumber}</Descriptions.Item>
            <Descriptions.Item label="最后登陆IP">{values.ip}</Descriptions.Item>
            <Descriptions.Item label="最后登陆时间">
              {values.lastTime ? moment(values.lastTime).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {values.registerTime ? moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="生日">
              {' '}
              {values.birthday ? moment(values.birthday).format('YYYY-MM-DD') : ''}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
