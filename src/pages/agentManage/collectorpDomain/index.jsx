import { Button, Card, Col, Form, Input, Row, Select, message, Modal } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import UpdateForm from './components/UpdateForm';
import { keysID, listId, menuText } from './keys.js';
import { filtEleBtn, takeIcon } from '@/utils/utils.js';
import buttonKey from '@/utils/buttonKey';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ collectorpDomainModel, loading, login }) => ({
  collectorpDomainModel,
  login,
  loading: loading.models.collectorpDomainModel,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
    stepFormValues: {},
    formValues: {},
    updateModalVisible: false,
  };

  columns = [
    {
      title: '域名名称',
      dataIndex: 'domainName',
    },
    {
      title: '域名地址',
      dataIndex: 'domainAddress',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    this.getReloadList();
  }

  getReloadList = params => {
    const {
      dispatch,
      collectorpDomainModel: { data },
    } = this.props;
    const { pagination = {} } = data || {};
    const { current = 1 } = pagination;

    dispatch({
      type: 'collectorpDomainModel/fetch',
      payload: {
        pageIndex: current,
        pageSize: 10,
        ...this.state.formValues,
        ...params,
      },
      callback: data => {
        //如删除最后一条数据  最后一页没有数据自动往前减一
        const { page = {} } = data;
        const list = data[listId] || [];
        this.setState({ selectedRows: [] });
        const { pageIndex = 1, pageCount = 1 } = page || {};
        if (pageIndex !== 1 && pageIndex > pageCount && list.length <= 0) {
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

  handleUpdateModalVisibleRole = (flag, record) => {
    const { dispatch } = this.props;

    this.setState({
      stepFormValues: record || {},
    });
    if (!!flag) {
      // dispatch({
      //   type: 'collectorpDomainModel/SysUserRoleLists',
      //   payload: { userID: record.userID},
      // })
      // .then(()=>{
      this.setState({ updateModalVisible: !!flag });
      // });
    } else {
      this.setState({ updateModalVisible: !!flag });
    }
  };

  //更新"用户"用户
  handleUpdate = fields => {
    const { dispatch } = this.props;
    console.log(fields, 'fields');
    dispatch({
      type: 'collectorpDomainModel/update',
      payload: fields,
      callback: () => {
        message.success('分配成功');
        this.handleUpdateModalVisibleRole();
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
          type: 'collectorpDomainModel/remove',
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
      let values = {
        ...fieldsValue,
      };
      if (values.isOnline) {
        values.isOnline = values.isOnline === 'true' ? true : false;
      }

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
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleDate = {} } = this.state;
    dispatch({
      type: 'collectorpDomainModel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.getReloadList();
        message.success(fields[keysID] ? '修改成功' : '添加成功');
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
          <Col md={6} sm={24}>
            <FormItem label="域名名称">
              {getFieldDecorator('domainName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="域名地址">
              {getFieldDecorator('domainAddress')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          {/* <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" icon="search">
                查询
              </Button>
              <Button
                icon="sync"
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
      collectorpDomainModel: { data },
      loading,
    } = this.props;

    const {
      selectedRows,
      modalVisible,
      editRoleDate,
      stepFormValues,
      updateModalVisible,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisibleRole,
      handleUpdate: this.handleUpdate,
    };

    const { login } = this.props;
    const sysUserPermissionList = login.sysUserPermissionList || [];
    // console.log('sysUserPermissionList',sysUserPermissionList)

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
                  <Button  icon='delete' type="danger"  onClick={this.handleMenuClick}>批量删除</Button>

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

        {updateModalVisible && stepFormValues[keysID] ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
