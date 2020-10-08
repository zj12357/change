import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    const Authorization = localStorage.getItem('Authorization');
    if ((!currentUser.userid && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!Authorization) {
      console.log('未登录 重定向 ', Authorization);
      return <Redirect to="/user/login"></Redirect>;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
