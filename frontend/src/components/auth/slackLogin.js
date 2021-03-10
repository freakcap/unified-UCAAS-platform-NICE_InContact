import React, { Component } from "react";
import axios from "axios";
import { config } from "../config/slackConfig";

class slackLogin extends Component {
  state = {
    tokendata: {},
    userdata: {},
  };

  authenticate() {
    console.log("Hi");
    var url =
      "https://slack.com/oauth/v2/authorize?scope=" +
      config.scopes +
      "&client_id=" +
      config.clientId +
      "&granular_bot_scope=0";
    window.location = url;
  }

  checkLoginStatus = () => {
    const userid = localStorage.getItem("SlackUserID");

    axios
      .get("http://localhost:3000" + "/slack/me", {
        headers: {
          atoken: this.state.tokendata,
          uid: userid,
        },
      })
      .then((result) => {
        this.setState({ userdata: result.data.user });
        console.log(result.data.user);
        var url = process.env.REACT_APP_redirectURL + "/";
        window.location = url;
      })
      .catch((error) => {
        console.log(error);
        this.authenticate();
      });
  };

  componentDidMount() {
    const tokens = localStorage.getItem("SlackAccessToken");
    // console.log("Tokens", tokens);
    // console.log("LOCAL_Login",localStorage.getItem('ZoomAccessToken'));
    if (tokens != null) {
      this.setState({ tokendata: tokens });
      this.checkLoginStatus();
    } else {
      //message: "Invalid access token."
      this.authenticate();
    }
    this.authenticate();
  }
  render() {
    return (
      <div>
        {this.state.userdata.real_name ? (
          <div>
            <div class="container">
              <div>
                <div>
                  <h1>Hello</h1>
                  <h2>{this.state.userdata.real_name.toString()}</h2>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1>LOGIN</h1>
          </div>
        )}
      </div>
    );
  }
}

export default slackLogin;
