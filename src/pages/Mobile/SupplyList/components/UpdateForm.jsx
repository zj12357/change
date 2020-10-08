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
  if (file.name.includes('.xlsx')) {
    return true;
  } else {
    message.error('只能上传.xlsx类型的文件');
    return false;
  }
}

@connect(({ SupplyListModel, loading }) => ({
  SupplyListModel,
  submitting: loading.effects['SupplyListModel/add'],
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
        title="上传供应商模板"
        visible={modalVisible}
        onCancel={handleModalVisibleUpload}
        onOk={this.okHandle}
        maskClosable={false}
      >
        <Row gutter={24}>
          <Col span={10}>
            <FormItem {...formItemLayout} label="供应商">
              <Upload
                // accept="image/*"
                name="file"
                // listType="picture-card"
                // className="avatar-uploader"
                action={baseUrl + '/api/Mobile/ImportMobileSupply'}
                beforeUpload={beforeUpload}
                onChange={this.onChange}
                // data={{ cid: mobileBatch }}
                headers={{ Authorization: localStorage.getItem('Authorization') }}
              >
                <Button>
                  <Icon type="upload" /> 上传供应商(
                  <span style={{ color: 'red' }}>只支持xlsx文件</span>)
                </Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>

        <Card style={{ marginTop: '20px' }}>
          <Row gutter={24}>
            <Col span={6}>
              <p style={{ textAlign: 'right' }}>示例表格：</p>
            </Col>
            <Col span={18}>
              <table border="1">
                <tbody>
                  <tr>
                    <th>Code</th>
                    <th>Desc</th>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>中国移动</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
