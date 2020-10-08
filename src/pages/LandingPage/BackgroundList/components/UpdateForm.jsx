import { Button, Form, Input, Modal, Radio, Select, Steps, Descriptions, Card } from 'antd';
import React, { Component } from 'react';
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;





const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};



class UpdateForm extends Component {



  componentDidMount() {



  }




  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values = {},
      submitting
    } = this.props;

    return (
      <Modal
        bodyStyle={{
          padding: '22px 12px 20px',
        }}
        destroyOnClose
        title={'详情信息'}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        afterClose={() => handleUpdateModalVisible(false)}
        onOk={() => handleUpdateModalVisible(false)}
        confirmLoading={submitting}
        maskClosable={false}
      >


        <Card bordered={false}>
          <Descriptions title=" " style={{ marginBottom: 12, }} column={1}>
            <Descriptions.Item label="是否禁用">{values.visible ? '开启' : '禁用'}</Descriptions.Item>
            <Descriptions.Item label="内容">
              <div dangerouslySetInnerHTML={{ __html: values.content }} ></div>
            </Descriptions.Item>


          </Descriptions>
        </Card>



      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
