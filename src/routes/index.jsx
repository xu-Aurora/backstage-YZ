import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute, Redirect, Switch } from 'dva/router';
import NotFound from '../components/notFound';//未匹配到页面
import App from '../components/'; // 引入菜单内容
import Login from '../login/'; //登录
function requireAuth() {
  // console.log(arguments)
}
function Routes({ history }) {
  return (
    <Router history={history}>
      <Switch>
      <Route exact path="/login" component={Login} />
      <Route path="/:id/app/" component={App} onChange={requireAuth()}/>
      <Route exact path="/404" component = {NotFound} />
      <Redirect exact path="/" to="/login" />
      <Route path = "*" component = {NotFound}/>
      </Switch>
    </Router>
  );
}
Routes.propTypes = {
  history: PropTypes.any // eslint-disable-line
};
export default Routes;
