import * as PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const userPropType = PropTypes.shape({
  id: PropTypes.number,
  email: PropTypes.string,
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  imageUrl: PropTypes.string,
  pushToken: PropTypes.string,
  token: PropTypes.string,
  role: PropTypes.string,
});
