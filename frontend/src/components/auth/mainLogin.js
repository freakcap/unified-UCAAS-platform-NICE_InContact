import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class mainLogin extends Component {
  state = {
    zoomLoginFlag: false,
    slackLoginFlag: false,
    zoomtokenData: null,
    slacktokenData: null,
  };

  checkZoomLoginStatus = () => {
    axios
      .get("http://localhost:3000" + "/zoom/user", {
        headers: {
          atoken: this.state.tokendata,
        },
      })
      .then((result) => {
        if (result.data.code == 124) {
          this.setState({ zoomLoginFlag: false });
        } else {
          this.setState({ zoomLoginFlag: true });
        }
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
        this.setState({ zoomLoginFlag: false });
      });
  };

  checkSlackLoginStatus = () => {
    let usrid = localStorage.getItem("SlackUserID");
    axios
      .get("http://localhost:3000" + "/slack/me", {
        headers: {
          atoken: this.state.slacktokenData,
          uid: usrid,
        },
      })
      .then((result) => {
        if (result.data.ok == "false") {
          console.log("error");
          this.setState({ slackLoginFlag: false });
        } else {
          this.setState({ slackLoginFlag: true });
        }
        console.log(result.data);
        // code: 124, message: "Invalid access token."
      })
      .catch((error) => {
        console.log(error);
        this.setState({ slackLoginFlag: false });
      });
  };

  componentDidMount() {
    const zoomTokens = localStorage.getItem("ZoomAccessToken");
    const slackTokens = localStorage.getItem("SlackAccessToken");
    if (zoomTokens != null) {
      this.setState({ zoomtokenData: zoomTokens }, () => {
        this.checkZoomLoginStatus();
      });
    } else if (zoomTokens == null) {
      this.setState({ zoomLoginFlag: false });
    }
    if (slackTokens != null) {
      this.setState({ slacktokenData: slackTokens }, () => {
        this.checkSlackLoginStatus();
      });
    } else if (slackTokens == null) {
      this.setState({ slackLoginFlag: false });
    }
  }
  render() {
    console.log(this.state.zoomLoginFlag);
    console.log(this.state.slackLoginFlag);
    return (
      <div>
        {this.state.slackLoginFlag && this.state.zoomLoginFlag ? (
          <Link
            to={{
              pathname: "/chat",
            }}
            className="btn btn-primary"
          >
            Logged In! Go To Chat
          </Link>
        ) : (
          <div>
            {this.state.zoomLoginFlag && !this.state.slackLoginFlag ? (
              <div>Logged Into Zoom</div>
            ) : (
              <div>
                <Link
                  to={{
                    pathname: "/zoomAuth",
                  }}
                  className="btn btn-primary"
                >
                  Zoom Login
                </Link>
              </div>
            )}
            {this.state.slackLoginFlag && !this.state.zoomLoginFlag ? (
              <div>Logged Into Slack</div>
            ) : (
              <div>
                <Link
                  to={{
                    pathname: "/slackAuth",
                  }}
                  className="btn btn-primary"
                >
                  Slack Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default mainLogin;
