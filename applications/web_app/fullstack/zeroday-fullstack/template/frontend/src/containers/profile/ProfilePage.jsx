import React from 'react';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

import { updateUser } from '../../actions/users';
import UserForm from '../../components/forms/UserForm';
import { userPropType } from '../../types/customPropTypes';
import Translatable from '../../components/translation/Translatable';

const ProfilePage = (props) => {
  const { user, handleUserUpdate } = props;
  return (
    <div className="section-main home">
      <div className="main-wrapper">
        <div className="main">
          <Header as="h1" textAlign="center">
            <Translatable capitalize translationKey="profile" />
          </Header>
          <UserForm initialValues={user} onSubmit={handleUserUpdate} />
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  user: userPropType.isRequired,
  handleUserUpdate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  handleUserUpdate: (params) => dispatch(updateUser(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
