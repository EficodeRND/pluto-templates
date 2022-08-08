import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Router from './Router';

import NavigationMain from '../components/navigation/NavigationMain';
import { userPropType } from '../types/customPropTypes';

const App = (props) => {
  const { user } = props;

  return (
    <BrowserRouter>
      <div>
        {user && <NavigationMain />}

        <Router />

      </div>
    </BrowserRouter>
  );
};

App.propTypes = {
  user: userPropType,
};

App.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => ({ user: state.auth.user });

export default connect(mapStateToProps)(App);
