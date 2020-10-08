import { Form, Input, InputNumber, Modal, Radio, Select, Cascader } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';
import { Col, Row } from 'antd';
import { keysID, listId } from './../keys.js';
import UploadImg from '@/components/Upload/UploadImg.jsx';
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

@connect(({ unionListModel, loading }) => ({
  unionListModel,
  submitting: loading.effects['unionListModel/add'],
}))
class CreateForm extends Component {
  state = {
    sysMenuList: [], //联赛列表
    isEditName: '新增',
    options,
    defaultValue: [],
    LeagueLevel: [],
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    this.getAreaValue();
    this.getStatusList();
  }
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
  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
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
        let LeagueLevel = list.filter(item => item.parentCode === 'LeagueLevel');
        this.setState({ LeagueLevel });
      },
    });
  };

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const countryById = fieldsValue.countryById;
      const editParentID = editRoleDate.countryById;

      const value = { ...editRoleDate, ...fieldsValue };

      if (Array.isArray(countryById) && countryById.length > 1) {
        value.countryById = countryById[1];
      } else {
        if (editParentID) {
          value.countryById = editParentID;
        } else {
          value.countryById = null;
        }
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
      unionListModel: { data },
      submitting,
    } = this.props;
    const { isEditName, defaultValue, LeagueLevel } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}联赛`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={950}
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="联赛名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入联赛名称！',
                  },
                ],
                initialValue: editRoleDate.name,
              })(<Input placeholder="请输入联赛名称" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="所属区域">
              {form.getFieldDecorator('countryById', {
                rules: [
                  {
                    required: true,
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
                  notFoundContent={'暂无数据'}
                  placeholder={'请选择'}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="联赛全称">
              {form.getFieldDecorator('fullName', {
                rules: [
                  {
                    required: false,
                    message: '请输入联赛全称！',
                  },
                ],
                initialValue: editRoleDate.fullName,
              })(<Input placeholder="请输入联赛全称" />)}
            </FormItem>
          </Col>
          <Col span={12}>
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
          <Col span={12}>
            <FormItem {...formItemLayout} label="等级">
              {form.getFieldDecorator('level', {
                rules: [
                  {
                    required: false,
                    message: '请输入等级！',
                  },
                ],
                initialValue: editRoleDate.level,
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  getPopupContainer={triggerNode => {
                    return triggerNode.parentNode || document.body;
                  }}
                >
                  {LeagueLevel.map((item, index) => (
                    <Option value={Number(item.code)} key={index}>
                      {item.displayName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem {...formItemLayout} label="排序">
              {form.getFieldDecorator('sort', {
                rules: [
                  {
                    required: false,
                    message: '请输入排序！',
                  },
                ],
                initialValue: editRoleDate.sort,
              })(<InputNumber style={{ width: '100%' }} min={1} placeholder="请输入排序" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="leisu ID">
              {form.getFieldDecorator('lesuById', {
                rules: [
                  {
                    required: false,
                    message: '请输入leisu ID！',
                  },
                ],
                initialValue: editRoleDate.lesuById,
              })(<Input placeholder="请输入leisu ID" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="联赛LOGO">
              {form.getFieldDecorator('logo', {
                rules: [
                  {
                    required: false,
                    message: '请输入联赛LOGO！',
                  },
                ],
                initialValue: editRoleDate.logo,
              })(<UploadImg />)}
            </FormItem>
          </Col>
        </Row>

        {/* <FormItem {...formItemLayout} label="所属区域">
          {form.getFieldDecorator('countryById', {
            rules: [
              {
                required: false,
                message: '请输入所属区域！',
              },
            ],
            initialValue: editRoleDate.countryById,
          })(
              <Select
                style={{ width:'100%' }}
                placeholder="请选择父级联赛">
                  {sysMenuList.map(item=>{
                    return (
                        <Option value={item.deptID} key={item.deptID}>{item.name}</Option>
                    )
                  })
                  }
            </Select>,
          )}
        </FormItem> */}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
