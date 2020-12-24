import "./App.css";
import React, { Component } from "react";
import "react-chat-elements/dist/main.css";
import "./index.css";
import auth from './components/auth/login';
import chat from './components/chat/chatScreen';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  authenticate(){
    
    fetch('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
        .then(response => response.json())
        .then(data => console.log(data));
  }

  componentDidMount(){
    this.authenticate();
  }
  render() {
    return (
      <Router>
      <div className="App">
        <Route exact path="/" component={auth} />  
        <Route exact path="/chat" component={chat} />
      </div>
      </Router>
    );
  }
  
}

export default App;
