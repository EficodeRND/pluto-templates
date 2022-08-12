import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Field, reduxForm, propTypes } from 'redux-form';
import Translatable, { getTranslation } from '../translation/Translatable';

const UserForm = (props) => {
  const { handleSubmit } = props;
  return (
    <Form onSubmit={handleSubmit}>
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
      <Button fluid type="submit">
        <Translatable capitalize translationKey="update" />
      </Button>
    </Form>
  );
};

UserForm.propTypes = {
  ...propTypes,
};

export default reduxForm({
  form: 'UserForm',
})(UserForm);
