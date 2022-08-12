import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Container, Divider, Header, Message,
} from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

import * as messagerActions from '../../actions/messager';
import Translatable from '../../components/translation/Translatable';
import { environment } from '../../utils/environmentUtils';

const url = environment.ENDPOINT
  ? environment.ENDPOINT
  : `${window.location.protocol}//${window.location.host}/api`;

class Messager extends Component {
  static propTypes = {
    onMessageAction: PropTypes.func.isRequired,
    messagerValue: PropTypes.string,
  };

  static defaultProps = {
    messagerValue: '',
  };

  sendMessage = () => {
    const { onMessageAction } = this.props;
    fetch(`${url}/hello`)
      .then((response) => response.json())
      .then((data) => onMessageAction(data.message));
  };

  render() {
    const { messagerValue } = this.props;
    const respText = (
      <Message>
        Backend response:
        { messagerValue }
      </Message>
    );
    return (
      <div>
        <Divider />
        <Container textAlign="center">
          <Header as="h3">Messager example</Header>
          <Button onClick={this.sendMessage}>
            <Translatable capitalize translationKey="messager_example" />
          </Button>
          { messagerValue && respText }
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messagerValue: state.messager.value,
});

const mapDispatchToProps = (dispatch) => ({
  onMessageAction: (value) => dispatch(messagerActions.messagerSetValue(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messager);
