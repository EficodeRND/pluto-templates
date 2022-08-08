/**
 * High-Order Component for session idle timeout
 * Logs user out, if user is not active in selected time (default 15 minutes)
 */

import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';

import { logout } from '../../actions/auth';
import IdleWarningMessage from './IdleWarningMessage';
import { environment } from '../../utils/environmentUtils';

// Events that triggers user is still active
const EVENT_TRIGGERS = [
  'load',
  'click',
  'scroll',
  'keypress',
];

const idleTime = environment.SESSION_IDLE_TTL
  ? parseInt(environment.SESSION_IDLE_TTL, 10) : 15 * 60; // in seconds
const warningTime = idleTime - 5 * 60; // By default, warning is shown 5 minutes before logout.

function withSessionTimeout(WrappedComponent, mapStateToProps) {
  class SessionTimeout extends React.Component {
        static propTypes = {
          dispatch: PropTypes.func.isRequired,
        };

        constructor() {
          super();
          this.state = {
            showWarning: false,
          };
        }

        componentDidMount() {
          EVENT_TRIGGERS.forEach((event) => {
            window.addEventListener(event, this.resetTimeout);
          });
          this.setTimeoutFunction();
        }

        clearTimeout = () => {
          if (this.warnTimeout) clearTimeout(this.warnTimeout);
          if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
        };

        setTimeoutFunction = () => {
          if (!localStorage.getItem('user')) { // User is not logged in, do nothing
            return;
          }
          this.warnTimeout = setTimeout(this.warn, warningTime * 1000);
          this.logoutTimeout = setTimeout(this.logout, idleTime * 1000);
        };

        resetTimeout = () => {
          const { showWarning } = this.state;
          if (!showWarning) {
            this.clearTimeout();
            this.setTimeoutFunction();
          }
        };

        warn = () => this.setState({ showWarning: true });

        continue = () => this.setState({ showWarning: false });

        logout = () => {
          const { dispatch } = this.props;
          this.clearTimeout();
          dispatch(logout());
          this.setState({ showWarning: false });
        };

        render() {
          const { showWarning } = this.state;
          return (
            <div>
              <IdleWarningMessage
                continueUse={() => this.continue()}
                logout={() => this.logout()}
                open={showWarning}
              />
              <WrappedComponent {...this.props} />
            </div>
          );
        }
  }

  return connect(mapStateToProps)(SessionTimeout);
}

export default withSessionTimeout;
