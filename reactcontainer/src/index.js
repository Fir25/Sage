import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import UserInfoApp from './store/userinfos/userinfos';
const store = createStore(UserInfoApp);
ReactDOM.render(
  <React.StrictMode>
   <Provider  store={store}>
  
    <App />
    </Provider>
  </React.StrictMode>,

  document.getElementById('root')
);
//store(redux)
reportWebVitals();