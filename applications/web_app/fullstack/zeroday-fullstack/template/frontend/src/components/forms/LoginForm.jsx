import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Field, propTypes } from 'redux-form';
import * as PropTypes from 'prop-types';
import Translatable, { getTranslation } from '../translation/Translatable';

const LoginForm = (props) => {
  const { onSubmit, submitting } = props;
  return (
    <Form loading={submitting} onSubmit={onSubmit}>
      <Form.Field>
        <Field
          component={Form.Input}
          placeholder=""
          name="email"
          type="email"
          label={
            <Translatable capitalize translationKey="email" />
          }
          required
          onInvalid={(e) => e.target.setCustomValidity(
            getTranslation('valid_field').toString(),
          )}
          onInput={(e) => e.target.setCustomValidity('')}
        />
      </Form.Field>
      <Form.Field>
        <Field
          component={Form.Input}
          placeholder=""
          name="password"
          type="password"
          label={
            <Translatable capitalize translationKey="password" />
          }
          required
          onInvalid={(e) => e.target.setCustomValidity(
            getTranslation('valid_field').toString(),
          )}
          onInput={(e) => e.target.setCustomValidity('')}
        />
      </Form.Field>
      <Button fluid type="submit" disabled={submitting}>
        <Translatable capitalize translationKey="login" />
      </Button>
    </Form>
  );
};

LoginForm.defaultProps = {
};

LoginForm.propTypes = {
  ...propTypes,
  onSubmit: PropTypes.func.isRequired,
};

export default LoginForm;
