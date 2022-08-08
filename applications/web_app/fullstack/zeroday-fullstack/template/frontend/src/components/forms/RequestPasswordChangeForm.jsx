import React from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import { Field, fieldPropTypes, propTypes } from 'redux-form';
import * as PropTypes from 'prop-types';
import Translatable, { getTranslation } from '../translation/Translatable';

const renderField = ({
  input,
  type,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Form.Field>
    <Form.Input {...input} {...custom} type={type} />
    {touched
      && ((error && <span>{error}</span>)
        || (warning && <span>{warning}</span>))}
  </Form.Field>
);

renderField.propTypes = {
  ...fieldPropTypes,
};

const RequestPasswordChangeForm = (props) => {
  const { onSubmit, resetRequestSentFlag, submitting } = props;
  return (
    <Form loading={submitting} onSubmit={onSubmit}>
      <Header as="h3">
        <Translatable capitalize translationKey="password_change_request" />
      </Header>
      <p>
        <Translatable capitalize translationKey="password_change_plaintext1" />
      </p>
      <Field
        name="email"
        component={renderField}
        label={
          <Translatable capitalize translationKey="email" />
        }
        required
        onInvalid={(e) => e.target.setCustomValidity(
          getTranslation('valid_field').toString(),
        )}
        onInput={(e) => e.target.setCustomValidity('')}
        type="email"
      />
      <Button fluid disabled={resetRequestSentFlag} type="submit">
        <Translatable capitalize translationKey="send_reset_confirmation" />
      </Button>
      {resetRequestSentFlag
        && (
        <p>
          <Translatable capitalize translationKey="password_change_plaintext2" />
        </p>
        )}
    </Form>
  );
};

RequestPasswordChangeForm.propTypes = {
  ...propTypes,
  onSubmit: PropTypes.func.isRequired,
  resetRequestSentFlag: PropTypes.bool.isRequired,
};

export default RequestPasswordChangeForm;
