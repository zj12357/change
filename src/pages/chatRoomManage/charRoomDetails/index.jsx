import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Tabs,
  Modal,
  Descriptions,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, filterImages } from '@/utils/utils.js';
import CustomDatePicker from '@/components/Picker/CustomDatePicker.jsx'
import router from 'umi/router';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const { TabPane } = Tabs;

function callback(key) {
  // console.log(key);
}


function filtArea(key) {
  return {
    0: '洲',
    1: '国',
    2: '城市',
  }[key] || '未知'
}

/* eslint react/no-multi-comp:0 */
@connect(({ charRoomDetailsModel, loading, login }) => ({
  charRoomDetailsModel,
  login,
  loading: loading.models.charRoomDetailsModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
    details: {},
    id: '',
  };

  columns = [
    {
      title: '账户名称',
      dataIndex: 'member_Account',
      fixed: 'left',
    },
    {
      title: '是否禁言',
      dataIndex: 'shutUpUntil',
      render: val => this.isShutUpUntil(val) ? '正常' : '禁言'
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: value => value === 'Member' ? '会员' : '平民'
    },
    {
      title: '消息序列',
      dataIndex: 'msgSeq',
    },
    {
      title: '消息标志',
      dataIndex: 'msgFlag',
      render: val => val === 'AcceptNotNotify' ? '接受通知' : '不接受通知',
    },
    {
      title: '联合时间',
      width: 220,
      dataIndex: 'joinTime',
      render: value => (value ? moment(value * 1000).format("YYYY-MM-DD HH:mm:ss") : ''),
    },
    {
      title: '上次发送时间',
      width: 220,
      dataIndex: 'lastSendMsgTime',
      render: value => (value ? moment(value * 1000).format("YYYY-MM-DD HH:mm:ss") : ''),
    },
    // {
    //   title: '操作',
    //   fixed: 'right',
    //   width: 150,
    //   render: (text, record) => (
    //     <Fragment>

    //       {/* <a onClick={() => this.handleUpdateModalVisible(record)}>编辑</a> */}
    //       <a onClick={() => this.enableAccount(record)}>{this.isShutUpUntil(record.shutUpUntil)  ? '禁言' : '解禁'}</a>
    //       {/* <Divider type="vertical" /> */}

    //       {/* {
    //             filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新建') ?
    //             <>
    //               <a onClick={() => this.handleModalVisible(true,'add',record[keysID])}>添加子系统广告图</a>
    //               <Divider type="vertical" />
    //             </>
    //             :false
    //           } */}

    //       {/* <a onClick={() => this.handleMenuClick('itemDelete', record)}>移除</a> */}

    //       {/* <Divider type="vertical" />
    //           <a onClick={() => this.enableAccount(record)}>{record.enable?'禁用':'启用'}</a> */}
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    // const id = '@TGS#3HM4XHSGE';
    const id = decodeURIComponent(this.props.location.query.id || '');
    this.setState({ id: String(id) }, () => {
      this.getReloadList();
      // this.getCharRoomDetails()
    })

  }
  //判断 禁言时间 是否小于当前时间  小于是正常状态
  isShutUpUntil = time => {
    const currentTime = Number.parseInt(new Date().getTime() / 1000);
    return currentTime > time
  }

  getCharRoomDetails = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'charRoomDetailsModel/getCharRoomDetails',
      payload: {
        id: this.state.id,
      },
      callback: (data) => {
        this.setState({ details: data || {} })
      }
    });
  }

  getReloadList = (params) => {

    const { dispatch, charRoomDetailsModel: { data } } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {} } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'charRoomDetailsModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...formValues,
        ...params,
        groupId: this.state.id,
      },
      callback: (data) => {//如删除最后一条数据  最后一页没有数据自动往前减一
        const { page = {} } = data;
        this.setState({ selectedRows: [] });
        const list = data || [];
        const { pageIndex = 1, pageCount = 1 } = page || {};;
        if (pageIndex !== 1 && pageIndex > pageCount && list.length <= 0) {
          this.getReloadList({ ...params, pageIndex: pageIndex - 1 })
        }
      }
    })
  }
  handleUpdateModalVisible = val => {
    this.setState({ editRoleDate: val });
    this.handleModalVisible(true);
  }

  handleUpdateModalVisibleRole = (flag, record) => {
    const { dispatch } = this.props;

    this.setState({
      stepFormValues: record || {},
    });
    if (!!flag) {
      dispatch({
        type: 'charRoomDetailsModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(() => {
        this.setState({ updateModalVisible: !!flag })
      });
    } else {
      this.setState({ updateModalVisible: !!flag })
    }

  };

  //更新系统广告图系统广告图
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个系统广告图');
      return false;
    }
    dispatch({
      type: 'charRoomDetailsModel/update',
      payload: {
        role: id,
        res: fields,
      },
      callback: () => {
        message.success('分配成功');
        this.handleUpdateModalVisibleRole();
      },
    });
  };


  enableAccount = record => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {
    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
    const { dispatch } = this.props;
    const { details = {} } = this.state;

    // if (record.username === details.owner_username) {
    //   message.error('聊天室所有者不可更改');
    //   return false;
    // }

    dispatch({
      type: 'charRoomDetailsModel/enableAccount',
      payload: {
        groupId: this.state.id,
        shutUpTime: this.isShutUpUntil(record.shutUpUntil) ? 60 * 60 * 24 : 0,
        members_Account: [record.member_Account]
      },
      callback: () => {
        message.success('操作成功');
        this.getReloadList();
      },

    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.getReloadList(params);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    }, () => this.getReloadList({ pageIndex: 1 }));

  };

  //type ='itemDelete'  否则删除多个
  handleMenuClick = (type, record) => {

    const { details = {} } = this.state;

    if (record.username === details.owner_username) {
      message.error('聊天室所有者不可更改');
      return false;
    }

    const _this = this;

    Modal.confirm({
      title: '删除',
      content: '您确定要删除当前内容嘛?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const { dispatch } = _this.props;
        const { selectedRows } = _this.state;

        if (!selectedRows) return;
        let userNameList = [];
        if (type === 'itemDelete') {
          userNameList.push(record.username)
        } else {
          selectedRows.forEach(item => {
            userNameList.push(item.username)
          });
        }

        dispatch({
          type: 'charRoomDetailsModel/remove',
          payload: {
            userNameList,
            id: _this.state.id,
          },
          callback: () => {
            message.success('删除成功');
            _this.setState({
              selectedRows: [],
            });
            _this.getReloadList();
          },
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      this.getReloadList({ ...values, pageIndex: 1 });
    });
  };

  handleModalVisible = (flag, type, parentID) => {
    let updateData = { modalVisible: !!flag };

    if (type === 'add') {
      updateData.editRoleDate = {};
      //  this.setState({editRoleDate:{}})
    }

    if (parentID) {
      updateData.parentID = parentID;
    } else {
      updateData.parentID = '';
    }


    this.setState({
      ...updateData
    });
  };



  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {}, parentID } = this.state;

    if (parentID) fields.parent = parentID;
    // console.log('parentID',parentID,fields)
    dispatch({
      type: 'charRoomDetailsModel/add',
      payload: {
        ...fields,
        groupId: this.state.id,
      },
      callback: () => {
        // this.getReloadList();
        // this.setState({ parentID: '' })
        message.success('发送成功');
        this.handleModalVisible();
      }
    });
  };



  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={6} sm={24}>
            <FormItem label="聊天室ID">
              {getFieldDecorator('聊天室ID')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          {/* <Col md={6} sm={24}>
            <FormItem label="内容">
              {getFieldDecorator('content')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="开始时间">
              {getFieldDecorator('betTime')(<CustomDatePicker />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="结束时间">
              {getFieldDecorator('endTime')(<CustomDatePicker />)}
            </FormItem>
          </Col> */}

          {/* <Col md={8} sm={24}>
            <FormItem label="所属区域">
              {getFieldDecorator('countryById')(
                //  <Select
                //     style={{ width:'100%' }}
                //     placeholder="请选择">
                //         <Option value={0}>洲</Option>
                //         <Option value={1}>国</Option>
                //         <Option value={2}>城市</Option>

                // </Select>,
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col> */}

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" icon="search">
                查询
              </Button>
              <Button
                icon='sync'
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>

            </span>
          </Col>
        </Row>
      </Form>
    );
  }




  render() {
    const {
      charRoomDetailsModel: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editRoleDate, stepFormValues, updateModalVisible, details = {} } = this.state;
    const { allResourcesList, yelResourcesList } = data; //分配系统广告图列表
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisibleRole,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderWrapper>
        <Button onClick={() => router.go(-1)}>返回上页</Button>

        {/* <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="聊天室详情" key="1">
            <Card bordered={false}>
              <Descriptions title="详情信息" style={{ marginBottom: 32, }} column={1}>
                <Descriptions.Item label="聊天室名称">{details.name}</Descriptions.Item>
                <Descriptions.Item label="所有者用户名">{details.owner_username}</Descriptions.Item>
                <Descriptions.Item label="会员总数">{details.total_member_count}</Descriptions.Item>
                <Descriptions.Item label="聊天室ID">{details.id}</Descriptions.Item>
                <Descriptions.Item label="appkey">{(details.appkey)}</Descriptions.Item>

                <Descriptions.Item label="最大成员数">{details.max_member_count}</Descriptions.Item>

                <Descriptions.Item label="描述">{details.description}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{(details.ctime ? moment(details.ctime).format("YYYY-MM-DD HH:mm:ss") : '')}</Descriptions.Item>

              </Descriptions>
            </Card>
          </TabPane>
          <TabPane tab="聊天室成员列表" key="2"> */}
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>

              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true, 'add')}
              >
                发送系统消息
                </Button>
              {/* <a onClick={() => this.enableAccount(record)}>{this.isShutUpUntil(record.shutUpUntil)  ? '禁言' : '解禁'}</a> */}
              <Button
                icon="eye-invisible"
                type="primary"
                onClick={() => this.enableAccount({})}
              >
                管理禁言
                </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button icon='delete' type="danger" onClick={this.handleMenuClick}>批量移除</Button>

                </span>
              )} */}
            </div>
            <StandardTable
              scroll={{ x: 1500 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {/* </TabPane>

        </Tabs> */}

        {modalVisible ? <CreateForm {...parentMethods} modalVisible={modalVisible} editRoleDate={editRoleDate} /> : false}

        {stepFormValues && updateModalVisible &&
          Object.keys(stepFormValues).length &&
          Array.isArray(allResourcesList) &&
          allResourcesList.length > 0 ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
              allResourcesList={allResourcesList}
              yelResourcesList={yelResourcesList}
            />
          ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
