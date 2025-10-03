import React from 'react';
import ReactLoading from 'react-loading';

const LoadingScreen: React.FC = () => (
  <div className="app__loading-screen">
    <div className="app__loading-spinner">
      <ReactLoading type="spinningBubbles" color="#666665" />
      <p>Loading portfolio…</p>
    </div>
  </div>
);

export default LoadingScreen;
