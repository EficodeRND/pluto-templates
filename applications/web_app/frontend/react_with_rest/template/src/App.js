import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_API_URL

function App() {
  const [backendResponse, setBackendResponse] = useState('');
  useEffect(() => {
    Axios.get(API_URL)
      .then((response) => {
        setBackendResponse(JSON.stringify(response));
      })
      .catch((response) => {
        setBackendResponse(response.status)
      });
  }, []);

  return (
    <div className="App">
      <div>Backend says: {backendResponse} </div>
    </div>
  );
}

export default App;
