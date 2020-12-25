import React, { Component } from "react";
import axios from "axios";


class login extends Component {
  authenticate() {
    var url = "https://zoom.us/oauth/authorize?response_type=code&client_id="+process.env.REACT_APP_clientID+"&redirect_uri="+process.env.REACT_APP_redirectURL+"/zoom_oauth_callback";
    window.location = url;
  }

  componentDidMount() {
    this.authenticate();
  }
  render() {
    return (
      <div>
        <h1>LOGIN</h1>
      </div>
    );
  }
}

export default login;
