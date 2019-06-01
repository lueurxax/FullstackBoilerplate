import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

const token = localStorage.getItem('token');
// If we have a token, consider the user to signed in
if (token) {
  // TODO we need update application state
}
OfflinePluginRuntime.install({
  onInstalled: () => {
    console.log('SW Event:', 'App is ready for offline usage');
  },
  onUpdating: () => {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: () => {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
  },

  onUpdateFailed: () => {
    console.log('SW Event:', 'onUpdateFailed');
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root'));
