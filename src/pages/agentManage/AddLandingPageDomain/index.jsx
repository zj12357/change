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


function filtArea(key) {
  return {
    0:'洲',
    1:'国',
    2:'城市',
  }[key] || '未知'
}

/* eslint react/no-multi-comp:0 */
@connect(({ AddLandingPageDomainModel, loading,login }) => ({
  AddLandingPageDomainModel,
  login,
  loading: loading.models.AddLandingPageDomainModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues:{},
    formValues: {},
    updateModalVisible:false,
    parentID:'',
    id:'',
  };

  columns = [
    {
      title: '域名',
      dataIndex: 'domainName',
    },
    {
      title: '域名地址',
      dataIndex: 'domainAddress',
    },
    {
      title: '名称',
      dataIndex: 'plName',
    },
    //  {
    //   title: '彩种分类',
    //   dataIndex: 'lotteryTypeName',
    // },
    // {
    //   title: '图片',
    //   dataIndex: 'imgAddress',
    //   render:(text) => ( text ?  <img src={filterImages(text)} alt="" style={{width:'60px'}}/> : '')
    // },


    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   render: value => (value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : ''),
    // },
    //  {
    //   title: '跳转地址',
    //   dataIndex: 'redirectAddress',
    // },
    //  {
    //   title: '备注',
    //   dataIndex: 'remark',
    // },
    // {
    //   title: '排序',
    //   dataIndex: 'sort',
    // },


    // {
    //   title: '父级系统广告图名称',
    //   dataIndex: 'parentName',
    // },
    // {
    //   title: '是否启用',
    //   dataIndex: 'enable',
    //   render: val => (val ? '启用' : '禁用'),
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    // },
    {
      title: '操作',
      render: (text, record) => (
         <Fragment>
              {
                filtEleBtn(this.props.login.sysUserPermissionList, menuText, '编辑') ?
                <>
                  <a onClick={() => this.handleUpdateModalVisible(record)}>编辑</a>
                  <Divider type="vertical" />
                </>
                :false
              }
              {/* {
                filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新建') ?
                <>
                  <a onClick={() => this.handleModalVisible(true,'add',record[keysID])}>添加子系统广告图</a>
                  <Divider type="vertical" />
                </>
                :false
              } */}
              {
                filtEleBtn(this.props.login.sysUserPermissionList, menuText, '删除') ?
                <>
                  <a onClick={() => this.handleMenuClick('itemDelete',record)}>删除</a>
                </>
                :false
              }
              {/* <Divider type="vertical" />
              <a onClick={() => this.enableAccount(record)}>{record.enable?'禁用':'启用'}</a> */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const id = this.props.location.query.id || '';
    this.setState({id:Number(id)},()=>{
      this.getReloadList();
    })
  }

  getReloadList = (params) => {

    const { dispatch , AddLandingPageDomainModel :{ data }} = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    const { formValues = {},id } = this.state;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'AddLandingPageDomainModel/fetch',
      payload: {
        pageIndex:current,
        pageSize:10,
        ...formValues,
        ...params,
        plid:id,
      },
      callback:(data)=>{//如删除最后一条数据  最后一页没有数据自动往前减一
          const { page = {} } = data;
          const list = data[listId] || [];
          const { pageIndex = 1, pageCount = 1 } = page || {};;
          if (pageIndex !== 1 && pageIndex > pageCount && list.length<=0  ){
              this.getReloadList({ ...params , pageIndex : pageIndex -1})
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
        type: 'AddLandingPageDomainModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(()=>{
          this.setState({ updateModalVisible: !!flag})
      });
    }else{
         this.setState({ updateModalVisible: !!flag})
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
      type: 'AddLandingPageDomainModel/update',
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
        type: 'AddLandingPageDomainModel/enableAccount',
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
    },()=>this.getReloadList({pageIndex:1}));

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

          dispatch({
              type: 'AddLandingPageDomainModel/remove',
              payload: { [keysID]: record[keysID] },
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
     this.getReloadList({...values,pageIndex:1});
    });
  };

  handleModalVisible = (flag,type,parentID) => {
    let updateData = { modalVisible: !!flag};

    if(type==='add'){
       updateData.editRoleDate = {};
      //  this.setState({editRoleDate:{}})
    }

    if ( parentID ){
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
    const { editRoleDate = {},parentID,id} = this.state;

    if (parentID) fields.parent = parentID;
    // console.log('parentID',parentID,fields)
    dispatch({
      type: 'AddLandingPageDomainModel/add',
      payload: {
        ...fields,
        plid:Number(id)
      },
      callback:()=>{
          this.getReloadList();
          this.setState({parentID:''})
          message.success( fields[keysID] ?'修改成功':'添加成功');
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
          <Col md={7} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="开始时间">
              {getFieldDecorator('betTime')(<CustomDatePicker/>)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="结束时间">
            {getFieldDecorator('endTime')(<CustomDatePicker/>)}
            </FormItem>
          </Col>

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
      AddLandingPageDomainModel: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible ,editRoleDate ,stepFormValues ,updateModalVisible} = this.state;
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
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>


              { filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新建') ? (
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handleModalVisible(true, 'add')}
                  >
                    新建
                  </Button>
              ) : false }

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
