import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

import { logout } from '../../actions/auth';
import { userPropType } from '../../types/customPropTypes';
import LanguageSwitcher from '../translation/LanguageSwitcher';
import Translatable from '../translation/Translatable';

const handleHome = (history) => history.push('/');
const handleProfile = (history) => history.push('/profile');
const handleLogout = (dispatch) => dispatch(logout());

const NavigationMain = (props) => {
  const { user, history, dispatch } = props;

  return (
    <Menu borderless fixed="top">
      <Menu.Item className="header" onClick={() => handleHome(history)}>
        <span className="logo" />
        <img alt="" className="navbar-logo" src="images/eficode_logo_black_200x150.png" />
      </Menu.Item>

      {user
        && (
          <Menu.Menu position="right">
            <LanguageSwitcher />
            <Dropdown item icon="user" simple>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleProfile(history)}>
                  <Translatable capitalize translationKey="profile" />
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => handleLogout(dispatch)}>
                  <Translatable capitalize translationKey="logout" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        )}
    </Menu>
  );
};

NavigationMain.propTypes = {
  user: userPropType.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default withRouter(connect(mapStateToProps)(NavigationMain));
