import { Form, Input, InputNumber, Modal, Radio, Select, Button, Tabs } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';

import moment from 'moment';
import { genID } from '@/utils/utils.js';
import { keysID, listId } from './../keys.js';
import { flatArrs } from '@/utils/utils.js';
import AddFileldForm from '@/components/Picker/AddFileldForm.jsx';

const FormItem = Form.Item;

const { Option } = Select;

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

function formatTime(str) {
  if (!str) return null;
  const reg = /^(([0-1][0-9])|([2][0-4]))(\:)[0-5][0-9](\:)[0-5][0-9]$/g;
  if (reg.test(str)) {
    return '2020-07-27T' + str;
  }
  return moment(str, 'YYYY-MM-DD HH:mm:ss')
    .utc(8)
    .format();
}

function editDateUTC(obj = {}) {
  // if ( Object.prototype.toString.call(obj) !== "[object Object]" ) return obj;

  const keysArr = Object.keys(obj);

  keysArr.forEach(key => {
    if (Array.isArray(obj[key]) && obj[key].length > 0) {
      obj[key].forEach(item => {
        item.startTime = formatTime(item.startTime);
        item.endTime = formatTime(item.endTime);
      });
    }

    if (
      (Array.isArray(obj[key]) && obj[key].length === 0) ||
      obj[key] === '[]' ||
      obj[key] === 'null'
    ) {
      obj[key] = null;
    }
  });

  // console.log(obj)
  return obj;
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ collectorListModel, loading }) => ({
  collectorListModel,
  submitting: loading.effects['collectorListModel/add'],
}))
class CreateForm extends Component {
  state = {
    purposeList: [], //用途列表
    modeList: [], //采集方式列表
    isEditName: '新增',
    defaultActiveKey: '1',
    CollectionCategoryID: [], //采集器分类列表
  };
  componentDidMount() {
    const { dispatch, editRoleDate = {} } = this.props;
    if (editRoleDate && editRoleDate[keysID]) {
      this.setState({ isEditName: '修改' });
    }
    dispatch({
      type: 'dictionaryListModel/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 300,
        showType: 3,
        showDisabled: true,
      },
      callback: data => {
        const list = data.dictionaryList || [];
        let purposeList = list.filter(item => item.parentCode === 'Usage');
        let modeList = list.filter(item => item.parentCode === 'CollectType');
        let CollectionCategoryID = list.filter(item => item.parentCode === 'PDCollectionCategory');
        this.setState({ modeList, purposeList, CollectionCategoryID });
      },
    });
  }

  okHandle = () => {
    const { form, handleAdd, editRoleDate = {} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      const fildValue = JSON.parse(JSON.stringify({ ...editRoleDate, ...fieldsValue }));
      const fildValue1 = editDateUTC(fildValue);
      // const userListCollectPeriod = this.props.form.getFieldsValue(['userListCollectPeriod']);
      // console.log('userListCollectPeriod',userListCollectPeriod);
      // console.log('fieldsValue',fieldsValue);
      // console.log('fildValue1', fildValue1);
      // return
      handleAdd(fildValue1);
    });
  };

  tabClickHandler = params => {
    this.setState({
      defaultActiveKey: params,
    });
  };

  getTimes = () => {
    console.log('userListCollectPeriod', this.props.form.getFieldsValue(['userListCollectPeriod']));
  };

  render() {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      editRoleDate = {},
      collectorListModel: { data },
      submitting,
    } = this.props;
    const {
      isEditName,
      purposeList = [],
      modeList = [],
      defaultActiveKey,
      CollectionCategoryID = [],
    } = this.state;
    // console.log('editRoleDate',editRoleDate)
    return (
      <Modal
        destroyOnClose
        title={`${isEditName}采集器`}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        confirmLoading={submitting}
        maskClosable={false}
        width={1050}
      >
        {/* <Button onClick={this.getTimes}>获取时间</Button> */}
        <Tabs
          animated={true}
          type="card"
          activeKey={defaultActiveKey}
          onTabClick={params => this.tabClickHandler(params)}
        >
          <TabPane tab="基本信息" key="1">
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="采集器名称">
                  {form.getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入采集器名称！',
                      },
                    ],
                    initialValue: editRoleDate.name,
                  })(<Input placeholder="请输入采集器名称" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="服务器IP">
                  {form.getFieldDecorator('serverIP', {
                    rules: [
                      {
                        required: false,
                        message: '请输入服务器IP！',
                      },
                    ],
                    initialValue: editRoleDate.serverIP,
                  })(<Input placeholder="请输入服务器IP" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="用途">
                  {form.getFieldDecorator('usageID', {
                    rules: [
                      {
                        required: false,
                        message: '请选择用途',
                      },
                    ],
                    initialValue: editRoleDate.usageID,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择用途"
                      getPopupContainer={triggerNode => {
                        return triggerNode.parentNode || document.body;
                      }}
                    >
                      {purposeList.map(item => {
                        return (
                          <Option value={item.code} key={item.code}>
                            {item.displayName}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem {...formItemLayout} label="采集方式">
                  {form.getFieldDecorator('collectTypeID', {
                    rules: [
                      {
                        required: true,
                        message: '请选择采集方式',
                      },
                    ],
                    initialValue: editRoleDate.collectTypeID,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择采集方式"
                      getPopupContainer={triggerNode => {
                        return triggerNode.parentNode || document.body;
                      }}
                    >
                      {modeList.map(item => {
                        return (
                          <Option value={item.code} key={item.code}>
                            {item.displayName}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="采集器分类">
                  {form.getFieldDecorator('collectionCategoryID', {
                    rules: [
                      {
                        required: false,
                        message: '请选择采集器分类',
                      },
                    ],
                    initialValue: editRoleDate.collectionCategoryID,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="请选择采集器分类"
                      getPopupContainer={triggerNode => {
                        return triggerNode.parentNode || document.body;
                      }}
                    >
                      {CollectionCategoryID.map(item => {
                        return (
                          <Option value={item.code} key={item.code}>
                            {item.displayName}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="异常通知(纸飞机)">
                  {form.getFieldDecorator('telegrams', {
                    rules: [
                      {
                        required: false,
                        message: '请输入异常通知(纸飞机)！',
                      },
                    ],
                    initialValue: editRoleDate.telegrams,
                  })(<Input placeholder="请输入异常通知(纸飞机)" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="异常通知(短信)">
                  {form.getFieldDecorator('phonenos', {
                    rules: [
                      {
                        required: false,
                        message: '请输入异常通知(短信)！',
                      },
                    ],
                    initialValue: editRoleDate.phonenos,
                  })(<Input placeholder="请输入异常通知(短信)" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="采集器备注">
                  {form.getFieldDecorator('remark', {
                    rules: [
                      {
                        required: false,
                        message: '请输入采集器备注！',
                      },
                      {
                        max: 50,
                        message: '最大不超过50个字符！',
                      },
                    ],
                    initialValue: editRoleDate.remark,
                  })(<Input placeholder="请输入采集器备注" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  wrapperCol={{
                    xs: {
                      span: 24,
                      offset: 0,
                    },
                    sm: {
                      span: formItemLayout.wrapperCol.span,
                      offset: formItemLayout.labelCol.span,
                    },
                  }}
                  label=""
                >
                  <Button type="primary" onClick={() => this.tabClickHandler('2')}>
                    下一步
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="用户列表配置" key="2">
            <FormItem {...formItemLayout} label="用户列表采集时间间隔">
              {form.getFieldDecorator('userListCollectInterval', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户列表采集时间间隔！',
                  },
                ],
                initialValue: editRoleDate.userListCollectInterval,
              })(
                <InputNumber
                  min={1}
                  placeholder="请输入用户列表采集时间间隔"
                  style={{ width: '50%' }}
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="用户列表采集时间段">
              {form.getFieldDecorator('userListCollectPeriod', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户列表采集时间段！',
                  },
                ],
                //"[{"startTime":"00:00:00","endTime":"23:59:59"}]"
                initialValue: editRoleDate.userListCollectPeriod || [],
              })(<AddFileldForm key={genID()} />)}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button type="primary" onClick={() => this.tabClickHandler('3')}>
                下一步
              </Button>
            </FormItem>
          </TabPane>
          <TabPane tab="用户详情配置" key="3">
            <FormItem {...formItemLayout} label="用户详情采集时间间隔">
              {form.getFieldDecorator('userDetailCollectInterval', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户详情采集时间间隔！',
                  },
                ],
                initialValue: editRoleDate.userDetailCollectInterval,
              })(
                <InputNumber
                  min={1}
                  placeholder="请输入用户详情采集时间间隔"
                  style={{ width: '50%' }}
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="用户详情采集时间段">
              {form.getFieldDecorator('userDetailCollectPeriod', {
                rules: [
                  {
                    required: false,
                    message: '请输入用户详情采集时间段！',
                  },
                ],
                //"[{"startTime":"00:00:00","endTime":"23:59:59"}]"
                initialValue: editRoleDate.userDetailCollectPeriod || [],
              })(<AddFileldForm key={genID()} />)}
            </FormItem>

            <FormItem
              wrapperCol={{
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button type="primary" onClick={() => this.tabClickHandler('4')}>
                下一步
              </Button>
            </FormItem>
          </TabPane>

          <TabPane tab="主页配置" key="4">
            <FormItem {...formItemLayout} label="主页采集时间间隔">
              {form.getFieldDecorator('homeCollectInterval', {
                rules: [
                  {
                    required: false,
                    message: '请输入主页采集时间间隔！',
                  },
                ],
                initialValue: editRoleDate.homeCollectInterval,
              })(
                <InputNumber
                  min={1}
                  placeholder="请输入主页采集时间间隔"
                  style={{ width: '50%' }}
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="主页采集时间段">
              {form.getFieldDecorator('homeCollectPeriod', {
                rules: [
                  {
                    required: false,
                    message: '请输入主页采集时间段！',
                  },
                ],
                //"[{"startTime":"00:00:00","endTime":"23:59:59"}]"
                initialValue: editRoleDate.homeCollectPeriod || [],
              })(<AddFileldForm key={genID()} />)}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button type="primary" onClick={() => this.tabClickHandler('5')}>
                下一步
              </Button>
            </FormItem>
          </TabPane>
          <TabPane tab="财务报表配置" key="5">
            <FormItem {...formItemLayout} label="财务报表采集时间间隔">
              {form.getFieldDecorator('financeReportCollectInterval', {
                rules: [
                  {
                    required: false,
                    message: '请输入财务报表采集时间间隔！',
                  },
                ],
                initialValue: editRoleDate.financeReportCollectInterval,
              })(
                <InputNumber
                  min={1}
                  placeholder="请输入财务报表采集时间间隔"
                  style={{ width: '50%' }}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="财务报表采集时间段">
              {form.getFieldDecorator('financeReportCollectPeriod', {
                rules: [
                  {
                    required: false,
                    message: '请输入财务报表采集时间段！',
                  },
                ],
                initialValue: editRoleDate.financeReportCollectPeriod || [],
              })(<AddFileldForm key={genID()} />)}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button type="primary" onClick={() => this.tabClickHandler('6')}>
                下一步
              </Button>
            </FormItem>
          </TabPane>

          <TabPane tab="游戏记录采集配置" key="6">
            <FormItem {...formItemLayout} label="游戏记录采集时间间隔">
              {form.getFieldDecorator('gameListCollectInterval', {
                rules: [
                  {
                    required: false,
                    message: '请输入游戏记录采集时间间隔！',
                  },
                ],
                initialValue: editRoleDate.gameListCollectInterval,
              })(
                <InputNumber
                  min={1}
                  placeholder="请输入游戏记录采集时间间隔"
                  style={{ width: '50%' }}
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="游戏记录采集条数">
              {form.getFieldDecorator('gameListCollectTotal', {
                rules: [
                  {
                    required: false,
                    message: '请输入游戏记录采集条数！',
                  },
                ],
                initialValue: editRoleDate.gameListCollectTotal,
              })(
                <InputNumber
                  min={1}
                  placeholder="请输入游戏记录采集条数"
                  style={{ width: '50%' }}
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="游戏记录采集时间段">
              {form.getFieldDecorator('gameListCollectPeriod', {
                rules: [
                  {
                    required: false,
                    message: '请输入游戏记录采集时间段！',
                  },
                ],
                //"[{"startTime":"00:00:00","endTime":"23:59:59"}]"
                initialValue: editRoleDate.gameListCollectPeriod || [],
              })(<AddFileldForm key={genID()} />)}
            </FormItem>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
