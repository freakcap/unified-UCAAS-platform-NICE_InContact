import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import { Link } from "react-router-dom"; 
import { config } from "../config/slackConfig";

class slackCallback extends Component {
  state = {
    tokendata: {},
    userdata: {},
  };

  authenticate() {
    const value = queryString.parse(this.props.location.search);
    console.log(value.code);
    if (value.code) {
      // replace with server URI
      axios
      .get("http://localhost:3000" + "/slack/auth", {
          headers: {
            authcode: value.code.toString(),
          },
        })
        .then((res) => {
          console.log(res)
          this.setState({ tokendata: res });
          localStorage.setItem(
            "SlackAccessToken",
            this.state.tokendata.data.access_token
          );
          localStorage.setItem(
            "SlackUserID",
            this.state.tokendata.data.user_id
          );
          console.log(this.state.tokendata.data.user_id)
          //console.log("LOCAL_Callback", localStorage.getItem("ZoomAccessToken"));
          axios
            .get("http://localhost:3000" + "/slack/me", {
              headers: {
                atoken: this.state.tokendata.data.access_token,
                uid : this.state.tokendata.data.user_id,
              },
            })
            .then((result) => {
              this.setState({ userdata: result.data.user });
              console.log(result.data.user);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("fiss");
    }
  }

  componentDidMount() {
    this.authenticate();
  }
  render() {
    return (
      <div>
        {this.state.userdata.real_name ? (
          <div>
            <div>
              <div>
                <div>
                  <h1>Hello</h1>
                  <h2>
                    {this.state.userdata.real_name.toString()}{" "}
                  </h2>
                </div>
              </div>
              <Link to={{pathname :"/chat" ,aboutProps:{slackuserdata:this.state.userdata, slacktokendata : this.state.tokendata}}} className="btn btn-primary">
                Go to chat
              </Link>
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

export default slackCallback;
