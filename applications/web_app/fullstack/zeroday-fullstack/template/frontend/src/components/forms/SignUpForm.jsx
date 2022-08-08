import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Field, propTypes } from 'redux-form';
import * as PropTypes from 'prop-types';
import Translatable, { getTranslation } from '../translation/Translatable';

const SignUpForm = (props) => {
  const { onSubmit, submitting } = props;
  return (
    <Form loading={submitting} onSubmit={onSubmit}>
      <Form.Field>
        <Field
          component={Form.Input}
          placeholder=""
          name="firstname"
          type="text"
          label={
            <Translatable capitalize translationKey="firstname" />
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
          name="lastname"
          type="text"
          label={
            <Translatable capitalize translationKey="lastname" />
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
        <Translatable capitalize translationKey="signup" />
      </Button>
    </Form>
  );
};

SignUpForm.defaultProps = {
};

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  ...propTypes,
};

export default SignUpForm;
