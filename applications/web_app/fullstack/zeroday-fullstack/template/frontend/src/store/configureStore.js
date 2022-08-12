import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../reducers';
import Api from '../api/Api';
import { environment } from '../utils/environmentUtils';

const api = new Api();

export default function configureStore() {
  const hasComposeExtension = (
    typeof window === 'object'
    && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function' // eslint-disable-line no-underscore-dangle
  );
  const composeEnhancers = (
    hasComposeExtension
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ // eslint-disable-line no-underscore-dangle
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose
  );

  const enhancer = composeEnhancers(
    applyMiddleware(thunk.withExtraArgument(api)),
  );

  let store;

  if (environment.NODE_ENV !== 'production') {
    store = createStore(reducer, enhancer);
  } else {
    const middleware = applyMiddleware(thunk.withExtraArgument(api));
    store = createStore(reducer, middleware);
  }

  api.dispatch = store.dispatch;

  return store;
}
