import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import withSessionTimeout from '../../components/auth/withSessionTimeout';
import { userPropType } from '../../types/customPropTypes';

const LoggedInRoute = (props) => {
  const { component: Component, user, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (!user) {
          return <Redirect to={{ pathname: '/login', state: { from: routeProps.location } }} />;
        }
        return <Component {...routeProps} />;
      }}
    />
  );
};

LoggedInRoute.propTypes = {
  component: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  user: userPropType,
};

LoggedInRoute.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => ({ user: state.auth.user });

export default withSessionTimeout(connect(mapStateToProps)(LoggedInRoute));
