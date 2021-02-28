import React, { Component } from "react";
import axios from "axios";

class login extends Component {
  state = {
    tokendata: {},
    userdata: {},
  };

  authenticate() {
    var url =
      "https://zoom.us/oauth/authorize?response_type=code&client_id=" +
      process.env.REACT_APP_clientID +
      "&redirect_uri=" +
      process.env.REACT_APP_redirectURL +
      "/zoom_oauth_callback";
    window.location = url;
  }

  checkLoginStatus = () => {
    axios
      .get("http://localhost:3000" + "/zoom/user", {
        headers: {
          atoken: this.state.tokendata,
        },
      })
      .then((result) => {
        this.setState({ userdata: result.data });
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
        this.authenticate();
      });
  };

  componentDidMount() {
    const tokens = localStorage.getItem('ZoomAccessToken');
    console.log("Tokens", tokens);
    console.log("LOCAL_Login",localStorage.getItem('ZoomAccessToken'));
    if (tokens != null) {
      this.setState({ tokendata: tokens });
      this.checkLoginStatus();
    } else {
      //message: "Invalid access token."
      this.authenticate();
    }
  }
  render() {
    return (
      <div>
        {this.state.userdata.first_name ? (
          <div>
            <div class="container">
              <div>
                <div>
                  <h1>Hello</h1>
                  <h2>
                    {this.state.userdata.first_name.toString()}{" "}
                    {this.state.userdata.last_name.toString()}
                  </h2>
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

export default login;
