import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import routes from 'routes';

import RouteHandler from 'handlers/RouteHandler';
import Overview from 'pages/Overview';
import Settings from 'pages/Settings';
import Mapping from 'pages/Mapping';
import Logs from 'pages/Logs';
import NotFound from 'pages/NotFound';
import Login from 'pages/Login';

const PrivateRoute = ({ children, ...rest }) => {

  const loggedIn = useSelector(state => state.user.loggedIn);

  return (
    <Route {...rest} render={() => {
      return loggedIn
        ? children
        : <Redirect to="/login" />;
    }}
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.any,
};


const Router = () => {

  const loggedIn = useSelector(state => state.user.loggedIn);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.login.def}>
          {loggedIn ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route exact path='/'>
          <Redirect to="/overview" />
        </Route>
        <PrivateRoute exact path={routes.overview.def}>
          <Overview />
        </PrivateRoute>
        <PrivateRoute exact path={routes.mapping.def}>
          <Mapping />
        </PrivateRoute>
        <PrivateRoute exact path={routes.settings.def}>
          <Settings />
        </PrivateRoute>
        <PrivateRoute exact path={routes.logs.def}>
          <Logs />
        </PrivateRoute>
        <PrivateRoute exact path={routes.support.def}>
          <Overview />
        </PrivateRoute>
        <Route>
          <NotFound />
        </Route>
      </Switch>

      {/* Handlers */}
      <RouteHandler />
    </BrowserRouter>
  );
};

export default Router;