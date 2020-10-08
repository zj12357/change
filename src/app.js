export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      console.error(e.message, 'dva报错信息');
    },
  },
  // plugins: [
  //   require('dva-logger')(),
  // ],
};


/**
  import {  Col, Row } from 'antd';

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  width={1050}

  <Row gutter={24}>
      <Col span={8}>

      </Col>
  </Row>

  时间显示不全

  width:220,



  固定表格

  fixed: 'right',
  width: 150,

  scroll={{ x: 1500 }}

  输入框防抖

  import {  Spin } from 'antd';
  import debounce from 'lodash/debounce';

  mode="multiple"
  showSearch
  showArrow={false} // 是否显示下拉小箭头
  notFoundContent={searchUserLoading ? <Spin size="small" /> : null}
  filterOption={false}
  onSearch={debounce(this.getSerachUser, 1000)}
  style={{ width: '100%' }}
  placeholder="请输入用户名称搜索用户"
  loading={searchUserLoading}


  固定列
  fixed: 'left',

  表格中等尺寸
  size={'middle'}

  单选
  selectedRows = selectedRows.length ? [selectedRows.pop()] : selectedRows;
  selectedRowKeys = selectedRowKeys.length ? [selectedRowKeys.pop()] : selectedRowKeys;

  const { selectedRows = [] } = this.state;
  if( Array.isArray(selectedRows) && selectedRows.length === 1){

  }else {
    message.error('请选择并且只能选择一项数据！');
    return false;
  }
  record = selectedRows[0];


  {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '新建') ? (
    <Button
      type="primary"
      onClick={() => this.handleModalVisible(true, 'add')}
    >
      新建
    </Button>
  ) : false}

  {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '编辑') ? (
    <Button
      type="primary"
      onClick={() => this.handleUpdateModalVisible()}
    >
      编辑
    </Button>
  ) : false}

  {filtEleBtn(this.props.login.sysUserPermissionList, menuText, '删除') ? (
    <Button
      type="primary"
      onClick={() => this.handleMenuClick('itemDelete')}
    >
      删除
    </Button>
  ) : false}

  新增 添加表格  保存搜索条件

  ...this.state.formValues,

  handleFormReset

  this.setState({
      formValues: {},
      selectedRows: []
    }, () => {
      this.getReloadList({ pageIndex: 1 });
    });

 */
