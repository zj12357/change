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
    message.error('只能上传xlsx和xls类型的文件');
    return false;
  }
}

@connect(({ MobileListModel, loading }) => ({
  MobileListModel,
  submitting: loading.effects['MobileListModel/add'],
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

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'SourceListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
      },
      callback: data => {
        let list = data.list;

        this.setState({ mobileBatchList: data.list || [] });
      },
    });
  }

  onCheckBatch = val => {
    this.setState({
      mobileBatch: val,
    });
  };
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
    const { mobileBatch, mobileBatchList } = this.state;
    return (
      <Modal
        width={800}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="上传白名单模板"
        visible={modalVisible}
        onCancel={handleModalVisibleUpload}
        onOk={this.okHandle}
        maskClosable={false}
      >
        <Row gutter={24}>
          <Col span={14}>
            <FormItem {...formItemLayout} label="渠道来源">
              {form.getFieldDecorator('cid', {
                rules: [
                  {
                    required: true,
                    message: '请选择数据渠道',
                  },
                ],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  placeholder="请选择数据渠道"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                  treeData={this.getChildren(mobileBatchList)}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  onChange={this.onCheckBatch}
                ></TreeSelect>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="白名单">
              <Upload
                // accept="image/*"
                name="file"
                // listType="picture-card"
                // className="avatar-uploader"
                action={baseUrl + `/api/Mobile/ImportMobile?cid=${mobileBatch}`}
                beforeUpload={beforeUpload}
                onChange={this.onChange}
                data={{ cid: mobileBatch }}
                headers={{ Authorization: localStorage.getItem('Authorization') }}
              >
                <Button>
                  <Icon type="upload" /> 上传白名单(
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
                    <th>Area</th>
                    <th>BatchNo</th>
                    <th>Mobile</th>
                  </tr>
                  <tr>
                    <td>南京市(归属地)</td>
                    <td>1313(批次)</td>
                    <td>15567899876(电话号码)</td>
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
