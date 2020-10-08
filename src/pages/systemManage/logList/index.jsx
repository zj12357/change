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
  Modal
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ logListModel, loading }) => ({
  logListModel,
  loading: loading.models.logListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues:{},
    formValues: {},
    updateModalVisible:false,
  };

  columns = [
   {
      title: '登录ip',
      dataIndex: 'ip',
    },
     {
      title: '操作用户',
      dataIndex: 'loginUser',
    },
    {
      title: '操作模块',
      dataIndex: 'module',
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      width:300,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //      <Fragment>
    //       {record && record.system === false? (
    //         <a>超级管理员不能修改</a>
    //       ) : (
    //              <Fragment>
    //                 <a onClick={() => this.handleUpdateModalVisible(record)}>编辑</a>
    //                 <Divider type="vertical" />
    //                 <a onClick={() => this.handleUpdateModalVisibleRole(true, record)}>分配权限</a>
    //                 {/* <Divider type="vertical" />
    //                 <a onClick={() => this.enableAccount(record)}>{record.enable?'禁用':'启用'}</a> */}
    //                 <Divider type="vertical" />
    //                 <a onClick={() => this.handleMenuClick('itemDelete',record)}>删除</a>
    //               </Fragment>
    //       )}
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
      this.getReloadList();
  }

  getReloadList = (params) => {

    const { dispatch , logListModel :{ data }} = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'logListModel/fetch',
      payload: {
        current,
        size:10,
        ...params,
      },
      callback:(data)=>{//如删除最后一条数据  最后一页没有数据自动往前减一
          const { current = 1, pages = 1, records = [] } = data;
          if (current !== 1 && current > pages && records.length<=0  ){
              this.getReloadList({ ...params , current : current -1})
          }
      }
    })
  }
  handleUpdateModalVisible = val => {
      this.setState({editRoleDate:val});
      this.handleModalVisible(true);
  }

  handleUpdateModalVisibleRole = (flag, record) => {
    const { dispatch } = this.props;

    this.setState({
      stepFormValues: record || {},
    });
    if (!!flag) {
      dispatch({
        type: 'logListModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(()=>{
          this.setState({ updateModalVisible: !!flag})
      });
    }else{
         this.setState({ updateModalVisible: !!flag})
    }

  };

   //更新角色权限
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个菜单');
      return false;
    }
    dispatch({
      type: 'logListModel/update',
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


  enableAccount=record=>{
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
        type: 'logListModel/enableAccount',
        payload: {
          id,
          enable:(record.enable?false:true)
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
      current: pagination.current,
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
    });
    this.getReloadList({current:1});
  };

  //type ='itemDelete'  否则删除多个
  handleMenuClick  = (type,record) => {
    const _this=this;
    Modal.confirm({
      title: '删除',
      content: '您确定要删除当前内容嘛?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
          const { dispatch } = _this.props;
          const { selectedRows } = _this.state;
          if (!selectedRows) return;
          let ids=[];
          if(type==='itemDelete'){
            ids.push(record.id)
          }else{
            selectedRows.forEach(item => {
              ids.push(item.id)
            });
          }
          dispatch({
              type: 'logListModel/remove',
              payload: {ids},
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
        searchProperties:'module',
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
     this.getReloadList({...values,current:1});
    });
  };

  handleModalVisible = (flag,type) => {
    if(type==='add'){
       this.setState({editRoleDate:{}})
    }
    this.setState({
      modalVisible: !!flag,
    });
  };



  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {}} = this.state;
    dispatch({
      type: 'logListModel/add',
      payload: {
        isSystem: false,
        id:editRoleDate.id,
        ...fields,
      },
      callback:()=>{
          this.getReloadList();
          message.success('添加成功');
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
          <Col md={8} sm={24}>
            <FormItem label="模块搜索">
              {getFieldDecorator('searchValue')(<Input placeholder="请输入(例:登录)" />)}
            </FormItem>
          </Col>

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
      logListModel: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible ,editRoleDate ,stepFormValues ,updateModalVisible} = this.state;
    const { allResourcesList, yelResourcesList } = data; //分配权限列表
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
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,'add')}>
                新建
              </Button> */}
              {selectedRows.length > 0 && (
                <span>
                  <Button  icon='delete' type="danger"  onClick={this.handleMenuClick}>批量删除</Button>

                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible?<CreateForm {...parentMethods} modalVisible={modalVisible}  editRoleDate={editRoleDate}/>:false}

         {stepFormValues &&updateModalVisible&&
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
