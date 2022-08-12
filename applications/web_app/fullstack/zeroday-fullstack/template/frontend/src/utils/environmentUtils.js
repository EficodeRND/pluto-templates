/* eslint-disable */
let environment;
if (typeof BUILD_ENV !== 'undefined') {
  // development - Replaced with actual values by webpack.DefinePlugin
  environment = { ...BUILD_ENV };
} else {
  // production - Set by start-nginx.sh
  environment = { ...window.buildEnv };
}

// eslint-disable-next-line import/prefer-default-export
export { environment };
