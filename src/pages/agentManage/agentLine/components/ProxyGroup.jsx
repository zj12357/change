import React, { Component } from 'react';
import { Select, Form, Modal, Row, Col, Input } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ agentLineModel, loading }) => ({
  agentLineModel,
  loading: loading.effects['agentLineModel/getProcyGroupList'],
}))
class ProxyGroup extends Component {
  state = {
    groupList: [],
    ProxyLineGroup: [],
  };
  componentDidMount() {
    this.getGroupList();
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
        let ProxyLineGroup = list.filter(item => item.parentCode === 'ProxyLineGroup');
        this.setState({ ProxyLineGroup });
      },
    });
  };
  getGroupList = () => {
    const { dispatch, editRoleDate } = this.props;
    dispatch({
      type: 'agentLineModel/getProcyGroupList',
      payload: {
        plid: editRoleDate.plid,
      },
      callback: data => {
        this.setState({
          groupList: data.list,
        });
      },
    });
  };
  updateGroup = () => {
    const { dispatch, form, editRoleDate, handleUpdateGroup } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'agentLineModel/updateProxyGroup',
        payload: {
          ...fieldsValue,
          plid: editRoleDate.plid,
        },
        callback: () => {
          handleUpdateGroup();
        },
      });
    });
  };

  render() {
    const { updateGroupVisible, handleUpdateGroup, form, editRoleDate } = this.props;
    const { groupList, ProxyLineGroup } = this.state;
    let defaultGroup = [];
    groupList.forEach(item => {
      defaultGroup.push(item.groupCode);
    });

    return (
      <Modal
        visible={updateGroupVisible}
        title="分组管理"
        onCancel={() => handleUpdateGroup()}
        width={700}
        onOk={this.updateGroup}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="代理线">
              {form.getFieldDecorator('plid', {
                rules: [
                  {
                    required: false,
                    message: '请选择代理线分组',
                  },
                ],
                initialValue: editRoleDate.name,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem {...formItemLayout} label="代理线分组">
              {form.getFieldDecorator('groupCodes', {
                rules: [
                  {
                    required: true,
                    message: '请选择代理线分组',
                  },
                ],
                initialValue: defaultGroup,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择代理线分组"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                  mode="multiple"
                >
                  {ProxyLineGroup.map((item, index) => (
                    <Option value={item.code} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(ProxyGroup);
