import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

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
          atoken: this.state.zoomtokenData,
        },
      })
      .then((result) => {
        if (result.data.code == 124) {
          this.setState({ zoomLoginFlag: false });
        } else {
          this.setState({ zoomLoginFlag: true });
        }
        console.log("AA", result.data);
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {this.state.slackLoginFlag && this.state.zoomLoginFlag ? (
          // <Link
          //   to={{
          //     pathname: "/chat",
          //   }}
          //   className="btn btn-primary"
          // >
          //   Logged In! Go To Chat
          // </Link>
          <Button
            href="/chat"
            size="lg"
            style={{ margin: "15px", height: "80px", width:"300px",padding:'25px', fontSize:'20px', fontWeight:'bold' }}
            active
            variant="success"
          >
            Logged In! Go To Chat
          </Button>
        ) : (
          <div>
            {this.state.zoomLoginFlag && !this.state.slackLoginFlag ? (
              <h1 style={{ margin: "10px" }}>Logged Into Zoom</h1>
            ) : (
              <div>
                <Button href="/zoomAuth" size="lg" style={{ margin: "20px", height: "80px", width:"200px",padding:'25px', fontSize:'20px', fontWeight:'bold'}}>
                  Zoom Login
                </Button>
              </div>
            )}
            {this.state.slackLoginFlag && !this.state.zoomLoginFlag ? (
              <h1 style={{ margin: "10px" }}>Logged Into Slack</h1>
            ) : (
              <div>
                <Button href="/slackAuth" size="lg" style={{ margin: "20px", height: "80px", width:"200px",padding:'25px', fontSize:'20px', fontWeight:'bold' }}>
                  Slack Login
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default mainLogin;
