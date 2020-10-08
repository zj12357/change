import { Button, Card, Col, Form, Input, Row, Select, message, Modal } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { filtEleBtn, takeIcon } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
const FormItem = Form.Item;
const { Option } = Select;

const menuText = '角色管理';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ roleListModel, loading, login }) => ({
  roleListModel,
  login,
  loading: loading.models.roleListModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
    type: 'menu', // 权限 jurisdiction   菜单  menu
    allResourcesList: [],
    yelResourcesList: [],
    editRoleDate: {},
    parentCode: '',
  };

  columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色代码',
      dataIndex: 'code',
    },
    {
      title: '角色备注',
      dataIndex: 'remark',
    },
    {
      title: '角色排序',
      dataIndex: 'order',
    },
  ];

  componentDidMount() {
    this.getReloadList();
  }

  getReloadList = params => {
    const {
      dispatch,
      roleListModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;
    // console.log('pagination``````````````````',pagination)

    dispatch({
      type: 'roleListModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...this.state.formValues,
        ...params,
      },
      callback: data => {
        //如删除最后一条数据  最后一页没有数据自动往前减一
        const { page = {}, sysRoleList = [] } = data;
        this.setState({ selectedRows: [] });
        const { pageIndex = 1, pageCount = 1 } = page;
        if (pageIndex !== 1 && pageIndex > pageCount && sysRoleList.length <= 0) {
          this.getReloadList({ ...params, pageIndex: pageIndex - 1 });
        }
      },
    });
  };
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
  };

  handleUpdateModalVisibleRole = (flag, record, type) => {
    const { dispatch } = this.props;
    if (type) {
      const { selectedRows = [] } = this.state;
      if (Array.isArray(selectedRows) && selectedRows.length === 1) {
      } else {
        message.error('请选择并且只能选择一项数据！');
        return false;
      }
      record = selectedRows[0];
    }
    let updateData = { stepFormValues: record || {} };

    if (type) {
      updateData.type = type;
    }

    this.setState({
      ...updateData,
      yelResourcesList: [],
      allResourcesList: [],
    });

    if (!!flag) {
      dispatch({
        type: 'roleListModel/getResourceByAdminIdServe',
        payload: {
          roleCode: record.code,
          type,
          parentCode: record.parentCode,
        },
        callback: (allResourcesList, yelResourcesList) => {
          this.setState({ updateModalVisible: !!flag, allResourcesList, yelResourcesList });
        },
      });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  //更新角色权限
  handleUpdate = arrs => {
    const { dispatch } = this.props;
    const { stepFormValues, type } = this.state;

    dispatch({
      type: 'roleListModel/update',
      payload: {
        roleCode: stepFormValues.code,
        sysRolePermissionDetailParam: arrs,
      },
      callback: () => {
        message.success('分配成功');
        this.handleUpdateModalVisibleRole();
        this.setState({
          selectedRows: [],
        });
        //清楚缓存，强制刷新
        // setTimeout(() => {
        //   window.location.reload();
        // });
      },
    });
  };

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
    this.setState(
      {
        formValues: {},
        selectedRows: [],
      },
      () => {
        this.getReloadList({ pageIndex: 1 });
      },
    );
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
          type: 'roleListModel/remove',
          payload: { id: record.id },
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

  handleModalVisible = (flag, type) => {
    if (type === 'add') {
      this.setState({ editRoleDate: {} });
    }
    if (type === 'small') {
      this.setState({ editRoleDate: {} });
      const { selectedRows = [] } = this.state;
      if (Array.isArray(selectedRows) && selectedRows.length === 0) {
        message.error('请选择并且只能选择一项数据！');
        return false;
      }
      this.setState({
        parentCode: selectedRows[0].code || '',
      });
    }

    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {}, parentCode } = this.state;
    if (parentCode) fields.parentCode = parentCode;
    dispatch({
      type: 'roleListModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        message.success(fields.id ? '修改成功' : '添加成功');
        this.handleModalVisible();
      },
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
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色代码">
              {getFieldDecorator('code')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      roleListModel: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
      type,
      yelResourcesList, //已分配权限列表
      allResourcesList, //所有分配权限列表
    } = this.state;
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
              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.QueryList) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.QueryList) || 'search'}
                  onClick={this.handleSearch}
                >
                  查询
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Resetting) ? (
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
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Add) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Add) || 'plus'}
                  onClick={() => this.handleModalVisible(true, 'add')}
                >
                  新建
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Edit) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Edit) || 'edit'}
                  onClick={() => this.handleUpdateModalVisible()}
                >
                  编辑
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(
                this.props.login.sysUserPermissionList,
                menuText,
                buttonKey.PermissionConfiguration,
              ) ? (
                <Button
                  type="primary"
                  icon={
                    takeIcon(this.props.login.dictionaryList, buttonKey.PermissionConfiguration) ||
                    'credit-card'
                  }
                  onClick={() => this.handleUpdateModalVisibleRole(true, {}, 'jurisdiction')}
                >
                  权限配置
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Add) ? (
                <Button
                  type="primary"
                  icon="reconciliation"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Add) || 'plus'}
                  onClick={() => this.handleModalVisible(true, 'small')}
                >
                  添加子角色
                </Button>
              ) : (
                false
              )}

              {filtEleBtn(this.props.login.sysUserPermissionList, menuText, buttonKey.Delete) ? (
                <Button
                  type="primary"
                  icon={takeIcon(this.props.login.dictionaryList, buttonKey.Delete) || 'delete'}
                  onClick={() => this.handleMenuClick('itemDelete')}
                >
                  删除
                </Button>
              ) : (
                false
              )}

              {/* {selectedRows.length > 0 && (
                <span>
                  <Button icon="delete" type="danger" onClick={this.handleMenuClick}>
                    批量删除
                  </Button>
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
        {modalVisible ? (
          <CreateForm {...parentMethods} modalVisible={modalVisible} editRoleDate={editRoleDate} />
        ) : (
          false
        )}

        {updateModalVisible && Array.isArray(allResourcesList) && allResourcesList.length > 0 ? (
          <UpdateForm
            {...updateMethods}
            type={type}
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
