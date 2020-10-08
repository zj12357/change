import { Form, Input, InputNumber, Modal, Radio, Select, Cascader, Col, Row, Spin } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';

import debounce from 'lodash/debounce';

import UploadImg from '@/components/Upload/UploadImg.jsx';
import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx';
import { keysID, listId } from '../keys.js';

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

const options = [
  {
    name: '洲',
    id: 0,
    isLeaf: false,
  },
  {
    name: '国',
    id: 1,
    isLeaf: false,
  },
  {
    name: '城市',
    id: 2,
    isLeaf: false,
  },
];

@connect(({ teamListModel, loading }) => ({
  teamListModel,
  submitting: loading.effects['teamListModel/add'],
  searchUserLoading: loading.effects['unionListModel/fetch'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], // 球队列表
    isEditName: '新增',
    options,
    defaultValue: [],
  };

  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    this.getAreaValue();
  }

  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
  };
  getAreaValue = () => {
    const { dispatch, editRoleDate = {} } = this.props;
    //获取绑定的区域
    dispatch({
      type: 'areaListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        level: editRoleDate.level,
      },
      callback: data => {
        const { options } = this.state;
        options.forEach((item, index) => {
          if (item.id == editRoleDate.level) {
            options[index].children = data.list;
          }
        });
        this.setState({
          options: [...options],
          defaultValue: [editRoleDate.areaLevelId, editRoleDate.countryById],
        });
      },
    });
  };
  loadData = selectedOptions => {
    const { dispatch } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const level = targetOption.id;
    targetOption.loading = true;

    dispatch({
      type: 'areaListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        level,
      },
      callback: data => {
        targetOption.loading = false;
        targetOption.children = data.list || [];
        this.setState({
          options: [...this.state.options],
        });
      },
    });
  };

  getSerachUser = name => {
    if (!name) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'unionListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10,
        name,
      },
      callback: data => {
        this.setState({ sysMenuList: data.list || [] });
      },
    });
  };

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { countryById } = fieldsValue;
      const editParentID = editRoleDate.countryById;

      const value = { ...editRoleDate, ...fieldsValue };

      if (Array.isArray(countryById) && countryById.length > 1) {
        value.countryById = countryById[1];
      } else if (editParentID) {
        value.countryById = editParentID;
      } else {
        value.countryById = null;
      }
      // console.log('fieldsValue', value)
      // form.resetFields();
      handleAdd(value);
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      teamListModel: { data },
      submitting,
      searchUserLoading,
    } = this.props;
    const { isEditName, sysMenuList = [], defaultValue } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}球队`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={1050}
      >
        <Row gutter={24}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="球队名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入球队名称！',
                  },
                ],
                initialValue: editRoleDate.name,
              })(<Input placeholder="请输入球队名称" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="英文名称">
              {form.getFieldDecorator('enName', {
                rules: [
                  {
                    required: false,
                    message: '请输入英文名称！',
                  },
                ],
                initialValue: editRoleDate.enName,
              })(<Input placeholder="请输入英文名称" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="所属区域">
              {form.getFieldDecorator('countryById', {
                rules: [
                  {
                    required: false,
                    message: '请选择所属区域！',
                  },
                ],
                initialValue: defaultValue,
              })(
                <Cascader
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  notFoundContent="暂无数据"
                  placeholder="请选择"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="所属联赛">
              {form.getFieldDecorator('leagueById', {
                rules: [
                  {
                    required: false,
                    message: '请输入所属联赛！',
                  },
                ],
                initialValue: editRoleDate.leagueById,
              })(
                <Select
                  showSearch
                  showArrow={false} // 是否显示下拉小箭头
                  notFoundContent={searchUserLoading ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={debounce(this.getSerachUser, 1000)}
                  style={{ width: '100%' }}
                  placeholder="请输入联赛名称搜索联赛"
                  loading={searchUserLoading}
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {sysMenuList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="主教练">
              {form.getFieldDecorator('coach', {
                rules: [
                  {
                    required: false,
                    message: '请输入主教练！',
                  },
                ],
                initialValue: editRoleDate.coach,
              })(<Input placeholder="请输入主教练" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="球队市值">
              {form.getFieldDecorator('money', {
                rules: [
                  {
                    required: false,
                    message: '请输入球队市值！',
                  },
                ],
                initialValue: editRoleDate.money,
              })(<InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="排序">
              {form.getFieldDecorator('sort', {
                rules: [
                  {
                    required: false,
                    message: '请输入排序！',
                  },
                ],
                initialValue: editRoleDate.sort,
              })(<InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="球员数量">
              {form.getFieldDecorator('playerNumber', {
                rules: [
                  {
                    required: false,
                    message: '请输入球员数量！',
                  },
                ],
                initialValue: editRoleDate.playerNumber,
              })(<InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="联赛积分">
              {form.getFieldDecorator('points', {
                rules: [
                  {
                    required: false,
                    message: '请输入联赛积分！',
                  },
                ],
                initialValue: editRoleDate.points,
              })(<InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="联赛排名">
              {form.getFieldDecorator('position', {
                rules: [
                  {
                    required: false,
                    message: '请输入联赛排名！',
                  },
                ],
                initialValue: editRoleDate.position,
              })(<InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="球场名称">
              {form.getFieldDecorator('courseName', {
                rules: [
                  {
                    required: false,
                    message: '请输入球场名称！',
                  },
                ],
                initialValue: editRoleDate.courseName,
              })(<Input placeholder="请输入球场名称" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="球场容量">
              {form.getFieldDecorator('courseCapacity', {
                rules: [
                  {
                    required: false,
                    message: '请输入球场容量！',
                  },
                ],
                initialValue: editRoleDate.courseCapacity,
              })(<InputNumber min={1} placeholder="请输入" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label="Logo">
              {form.getFieldDecorator('logo', {
                rules: [
                  {
                    required: false,
                    message: '请输入Logo！',
                  },
                ],
                initialValue: editRoleDate.logo,
              })(<UploadImg />)}
            </FormItem>
          </Col>
        </Row>

        {/* <FormItem {...formItemLayout} label="创建时间">
          {form.getFieldDecorator('establishedTime', {
            rules: [
              {
                required: false,
                message: '请输入创建时间！',
              },
            ],
            initialValue: editRoleDate.establishedTime,
          })(<CustomDatePicker/>)}
        </FormItem> */}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
