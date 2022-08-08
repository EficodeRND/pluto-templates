import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

const ModalContent = ({ logout, continueUse }) => (
  <Modal.Content>
    <p>You will be logged out soon</p>
    <Button primary onClick={logout}>Logout now</Button>
    <Button onClick={continueUse}>Do not logout</Button>
  </Modal.Content>
);

ModalContent.propTypes = {
  logout: PropTypes.func.isRequired,
  continueUse: PropTypes.func.isRequired,
};

const IdleWarningMessage = ({ logout, continueUse, open }) => (
  <Modal
    open={open}
    content={<ModalContent continueUse={continueUse} logout={logout} />}
  />
);

IdleWarningMessage.propTypes = {
  logout: PropTypes.func.isRequired,
  continueUse: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default IdleWarningMessage;
