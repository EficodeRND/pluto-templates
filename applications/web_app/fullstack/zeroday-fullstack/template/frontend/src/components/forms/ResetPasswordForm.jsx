/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Field, fieldPropTypes } from 'redux-form';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import Translatable from '../translation/Translatable';

const required = (value) => (!value ? 'Required' : undefined);
const matches = (value, allValues) => (value !== allValues.newPassword ? 'Passwords must match' : undefined);

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
}) => (
  <Form.Field>
    <label htmlFor={input.name}>
      {label}
      <input {...input} type={type} />
      {touched
        && ((error && <span>{error}</span>)
          || (warning && <span>{warning}</span>))}
    </label>
  </Form.Field>
);

renderField.propTypes = {
  ...fieldPropTypes,
};

const ResetPasswordForm = (props) => {
  const { onSubmit, passwordChangedFlag } = props;
  return (
    <Form onSubmit={onSubmit}>
      <Field placeholder="" name="newPassword" component={renderField} type="password" validate={[required]} label="New password" />
      <Field placeholder="" name="verifyPassword" component={renderField} type="password" validate={[required, matches]} label="Confirm new password" />

      <Form.Field hidden>
        <label htmlFor="token">
          <Translatable capitalize translationKey="reset_token" />
          :
          <Field disabled placeholder="" name="token" component="input" type="text" />
        </label>
      </Form.Field>

      <Button fluid disabled={passwordChangedFlag} type="submit">
        <Translatable capitalize translationKey="change_password" />
      </Button>
      {passwordChangedFlag
      && (
        <p>
          <Translatable translationKey="password_changed" />
          {' '}
          <Link to="/login">
            <Translatable translationKey="login" />
          </Link>
          .
        </p>
      )}
    </Form>
  );
};

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  passwordChangedFlag: PropTypes.bool.isRequired,
};

export default ResetPasswordForm;
