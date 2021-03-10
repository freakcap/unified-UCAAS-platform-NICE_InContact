import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class login extends Component {
  state = {
    tokendata: "",
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
    console.log("TOKEN STATE ", this.state.tokendata);
    axios
      .get("http://localhost:3000" + "/zoom/user", {
        headers: {
          atoken: this.state.tokendata,
        },
      })
      .then((result) => {
        if (result.data.code == 124) {
          localStorage.clear();
          this.authenticate();
        } else {
          this.setState({ userdata: result.data });
          var url = process.env.REACT_APP_redirectURL + "/";
          window.location = url;
        }
        console.log(result.data);
        // code: 124, message: "Invalid access token."
      })
      .catch((error) => {
        console.log(error);
        localStorage.clear();
        window.location.reload();
      });
  };

  componentDidMount() {
    const tokens = localStorage.getItem("ZoomAccessToken");
    if (tokens != null) {
      console.log("LOCAL_Login", localStorage.getItem("ZoomAccessToken"));
      console.log("Tokens", tokens);
      this.setState({ tokendata: tokens }, () => {
        this.checkLoginStatus();
      });
    } else {
      this.authenticate();
    }
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {this.state.userdata.first_name ? (
          <div>
            {/* <div class="container">
              <div>
                <div>
                  <h1>Hello</h1>
                  <h2>
                    {this.state.userdata.first_name.toString()}{" "}
                    {this.state.userdata.last_name.toString()}
                  </h2>
                </div>
              </div>
              <Link
                to={{
                  pathname: "/chat",
                  aboutProps: {
                    userdata: this.state.userdata,
                    tokendata: this.state.tokendata,
                  },
                }}
                className="btn btn-primary"
              >
                Go to chat
              </Link>
            </div> */}
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
