import React from 'react';

const ScrollToTopOnMount = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  });
  return null;
};

export default ScrollToTopOnMount;
