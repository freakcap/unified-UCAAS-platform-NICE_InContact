import "./App.css";
import React, { Component } from "react";
import "react-chat-elements/dist/main.css";
import "./index.css";
import auth from './components/auth/login';
import chat from './components/chat/chatScreen';
import zoomCallback from './components/callbacks/zoomCallback'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import slackLogin from './components/auth/slackLogin';
import slackCallback from "./components/callbacks/slackCallback";
import mainLogin from './components/auth/mainLogin';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
        <Route exact path="/" component={mainLogin} />  
        <Route exact path="/slackAuth" component={slackLogin} />
        <Route exact path="/zoomAuth" component={auth} />  
        <Route exact path="/chat" component={chat} />
        <Route exact path="/zoom_oauth_callback" component={zoomCallback} />
        <Route exact path="/slack_oauth_callback" component={slackCallback} />
      </div>
      </Router>
    );
  }
}

export default App;
