import React from 'react';
import { connect } from 'react-redux';

import { Header } from 'semantic-ui-react';
import Messager from '../messagers/Messager';
import { userPropType } from '../../types/customPropTypes';
import Translatable from '../../components/translation/Translatable';

const HomePage = (props) => {
  const { user } = props;

  return (
    <div className="section-main home">
      <div className="main-wrapper">
        <div className="main">
          <Header as="h1" textAlign="center">
            <Translatable capitalize translationKey="hello" />
            {' '}
            {user.firstname}
          </Header>
          <Messager />
        </div>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  user: userPropType.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomePage);
