import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoggedInRoute from './auth/LoggedInRoute';

import Login from './auth/Login';
import SignUp from './auth/SignUp';
import RequestPasswordChange from './auth/RequestPasswordChange';
import ResetPasswordPage from './auth/ResetPassword';
import LogoutPage from './auth/LogoutPage';
import HomePage from './home/HomePage';
import ProfilePage from './profile/ProfilePage';

const Router = () => (
  <Switch>
    <LoggedInRoute exact path="/" component={HomePage} />
    <LoggedInRoute exact path="/profile" component={ProfilePage} />

    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgottenpassword" component={RequestPasswordChange} />
    <Route path="/resetpassword/:token" component={ResetPasswordPage} />
    <Route path="/logout" component={LogoutPage} />
  </Switch>
);

export default Router;
