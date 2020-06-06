import React, { useEffect } from 'react';
import './App.css';
// import Dashboard from './routes/dashboard'
// import Login from './pages/Login'
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from "./store/store";
// import { loadUser, logout } from "./actions/authActions";
import FetchService from "./services/fetch-service";
import PostService from "./services/post-service";

import MainRouter from "./routes/main";

export const FetchServiceModule = new FetchService();
export const PostServiceModule = new PostService();

function App() {

  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" component={MainRouter} />
          </Switch>
        </div>
      </Router>
  );
}

export default App;
