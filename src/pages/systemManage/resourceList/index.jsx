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
import { filtEleBtn, takeIcon } from '@/utils/utils.js';
import  buttonKey from '@/utils/buttonKey';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({ resourceListModel, loading, login }) => ({
  resourceListModel,
  login,
  loading: loading.models.resourceListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    parentID: '',
  };

  columns = [

    {
      title: '权限名称',
      dataIndex: 'pName',
    },
    {
      title: '权限类型',
      dataIndex: 'ptpyeName',
    },
    {
      title: '权限控制节点',
      dataIndex: 'node',
    },
    {
      title: '权限备注',
      dataIndex: 'remark',
    },
    {
      title: '权限排序',
      dataIndex: 'order',
    },

    // {
    //   title: '权限状态',
    //   dataIndex: 'ptpyeName',
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
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <Fragment>
    //       {
    //         filtEleBtn(this.props.login.sysUserPermissionList, menuText, '编辑') ?
    //           <>
    //             <a onClick={() => this.handleUpdateModalVisible(record)}>编辑</a>
    //             <Divider type="vertical" />
    //           </>
    //           : false
    //       }
    //       {
    //         filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新建') ?
    //           <>
    //             <a onClick={() => this.handleModalVisible(true, 'add', record.pid)}>添加子权限</a>
    //             <Divider type="vertical" />
    //           </>
    //           : false
    //       }
    //       {
    //         filtEleBtn(this.props.login.sysUserPermissionList, menuText, '删除') ?
    //           <>
    //             <a onClick={() => this.handleMenuClick('itemDelete', record)}>删除</a>
    //           </>
    //           : false
    //       }
    //       {/* <a onClick={() => this.handleUpdateModalVisible(record)}>编辑</a>
    //           <Divider type="vertical" />
    //           <a onClick={() => this.handleModalVisible(true,'add',record.pid)}>添加子权限</a> */}
    //       {/* <Divider type="vertical" />
    //           <a onClick={() => this.handleUpdateModalVisibleRole(true, record)}>分配权限</a> */}
    //       {/* <Divider type="vertical" />
    //           <a onClick={() => this.enableAccount(record)}>{record.enable?'禁用':'启用'}</a> */}
    //       {/* <Divider type="vertical" />
    //           <a onClick={() => this.handleMenuClick('itemDelete',record)}>删除</a> */}
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    this.getReloadList();
  }

  getReloadList = (params) => {

    const { dispatch, resourceListModel: { data } } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'resourceListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...params,
      },
      callback: (data) => {//如删除最后一条数据  最后一页没有数据自动往前减一
        const { page = {} } = data;
        this.setState({ selectedRows: [] })
        const list = data[listId] || [];
        const { pageIndex = 1, pageCount = 1 } = page || {};;
        if (pageIndex !== 1 && pageIndex > pageCount && list.length <= 0) {
          this.getReloadList({ ...params, pageIndex: pageIndex - 1 })
        }
      }
    })
  }
  handleUpdateModalVisible = val => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {

    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    val = selectedRows[0];
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
        type: 'resourceListModel/getResourceByAdminIdServe',
        payload: record.id,
      }).then(() => {
        this.setState({ updateModalVisible: !!flag })
      });
    } else {
      this.setState({ updateModalVisible: !!flag })
    }

  };

  //更新权限权限
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { id } = this.state.stepFormValues;
    console.log(fields, 'fields');
    if (!fields || (Array.isArray(fields) && fields.length <= 0)) {
      message.error('至少请选择一个权限');
      return false;
    }
    dispatch({
      type: 'resourceListModel/update',
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
    const { dispatch } = this.props;
    const { id } = record;
    dispatch({
      type: 'resourceListModel/enableAccount',
      payload: {
        id,
        enable: (record.enable ? false : true)
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
    });
    this.getReloadList({ pageIndex: 1 });
  };

  //type ='itemDelete'  否则删除多个
  handleMenuClick = (type, record) => {
    const { selectedRows = [] } = this.state;
    if (Array.isArray(selectedRows) && selectedRows.length === 1) {

    } else {
      message.error('请选择并且只能选择一项数据！');
      return false;
    }
    record = selectedRows[0];
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

        dispatch({
          type: 'resourceListModel/remove',
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
        searchProperties: 'role_name',
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
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

    if (type === 'small') {
      updateData.editRoleDate = {};
      const { selectedRows = [] } = this.state;
      if (Array.isArray(selectedRows) && selectedRows.length === 1) {

      } else {
        message.error('请选择并且只能选择一项数据！');
        return false;
      }
      parentID = selectedRows[0].pid;
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


    if (parentID) fields.parentID = parentID;

    dispatch({
      type: 'resourceListModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        this.setState({ parentID: '' })
        message.success(fields.pid ? '修改成功' : '添加成功');
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
            <FormItem label="权限名称">
              {getFieldDecorator('pName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          {/* <Col md={8} sm={24}>
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
          </Col> */}
        </Row>
      </Form>
    );
  }




  render() {
    const {
      resourceListModel: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, editRoleDate, stepFormValues, updateModalVisible } = this.state;
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


            <Button type="primary" icon="search" onClick={this.handleSearch}>
                查询
              </Button>
              <Button
                type="primary"
                icon="sync"
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>


              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新建') ? (
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => this.handleModalVisible(true, 'add')}
                >
                  新建
                </Button>
              ) : false}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '编辑') ? (
                <Button
                  type="primary"
                  icon="edit"
                  onClick={() => this.handleUpdateModalVisible()}
                >
                  编辑
                </Button>
              ) : false}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新建') ? (
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => this.handleModalVisible(true, 'small')}
                >
                  添加子权限
                </Button>
              ) : false}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '删除') ? (
                <Button
                  type="primary"
                  icon="delete"
                  onClick={() => this.handleMenuClick('itemDelete')}
                >
                  删除
                </Button>
              ) : false}

              {/* {selectedRows.length > 0 && (
                <span>
                  <Button icon='delete' type="danger" onClick={this.handleMenuClick}>批量删除</Button>

                </span>
              )} */}
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
