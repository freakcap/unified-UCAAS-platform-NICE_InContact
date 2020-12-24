import React, { Component } from "react";
import axios from "axios";

class login extends Component {
  authenticate() {
    let config = {
      header: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .post(
        "https://zoom.us/oauth/authorize?response_type=code&client_id=" +
          "jDlZBSjfSeuj3Osz0RgeRg" +
          "&redirect_uri=" +
          "https://d6cfe58ddab1.ngrok.io",
          config
      )
      .then((response) => response.json())
      .then((data) => console.log(data));
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
