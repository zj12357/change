import { Button, Modal, TreeSelect, Row, Col, Card, Form } from 'antd';
import React, { Component } from 'react';
import { Upload, message, Icon } from 'antd';
import { baseUrl } from '@/utils/config.js';

import { connect } from 'dva';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
function beforeUpload(file) {
  if (file.name.includes('.json')) {
    return true;
  } else {
    message.error('只能上传.json类型的文件');
    return false;
  }
}

@connect(({ AttributionListModel, loading }) => ({
  AttributionListModel,
  submitting: loading.effects['AttributionListModel/add'],
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
      mobileBatch: '',
      mobileBatchList: [],
    };
  }

  componentWillMount() {}

  onChange = info => {
    // console.log(info);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    const { response = {} } = info.file;
    if (!response.resultData) {
      if (response.message) {
        message.info(response.message);
      }
      return false;
    }
    if (info.file.status === 'done' && response.resultData) {
      message.success('上传成功', 2);
      const { getReloadList, handleModalVisibleUpload } = this.props;
      getReloadList({ current: 1 });
      handleModalVisibleUpload();
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  getChildren = data => {
    return data.map(item => {
      return {
        title: item.name,
        key: item.id,
        value: item.id,
        children:
          item.children == null || item.children.length <= 0 ? [] : this.getChildren(item.children),
      };
    });
  };

  okHandle = () => {
    const { form, handleModalVisibleUpload } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleModalVisibleUpload();
    });
  };
  render() {
    const { modalVisible, handleModalVisibleUpload, form } = this.props;
    return (
      <Modal
        width={640}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="上传归属地模板"
        visible={modalVisible}
        onCancel={handleModalVisibleUpload}
        onOk={this.okHandle}
        maskClosable={false}
      >
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="归属地">
              <Upload
                // accept="image/*"
                name="file"
                // listType="picture-card"
                // className="avatar-uploader"
                action={baseUrl + '/api/Mobile/ImportMobileAttribute'}
                beforeUpload={beforeUpload}
                onChange={this.onChange}
                // data={{ cid: mobileBatch }}
                headers={{ Authorization: localStorage.getItem('Authorization') }}
              >
                <Button>
                  <Icon type="upload" /> 上传归属地(
                  <span style={{ color: 'red' }}>只支持json文件</span>)
                </Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>

        <Card style={{ marginTop: '20px' }}>
          <Row gutter={24}>
            <Col span={6}>
              <p style={{ textAlign: 'right' }}>示例json：</p>
            </Col>
            <Col span={18}>
              <pre>{'{\n' + '    "1300000":"山东,济南,2",\n' + '}'}</pre>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
