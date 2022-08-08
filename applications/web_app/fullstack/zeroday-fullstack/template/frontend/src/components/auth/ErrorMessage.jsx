import React from 'react';
import { Message } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import Translatable from '../translation/Translatable';

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }
  return (
    <Message
      error
      header={
        <Translatable capitalize translationKey={message} />
      }
    />
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
