import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

class zoomCallback extends Component {
  state = {
    tokendata: {},
    userdata: {},
  };

  authenticate() {
    const value = queryString.parse(this.props.location.search);
    if (value.code) {
      // replace with server URI
      axios
        .get("http://localhost:3000" + "/zoom/auth", {
          headers: {
            authData: value.code.toString(),
          },
        })
        .then((res) => {
          this.setState({ tokendata: res });
          localStorage.setItem(
            "ZoomAccessToken",
            this.state.tokendata.data.access_token
          );
          console.log(
            "LOCAL_Callback",
            localStorage.getItem("ZoomAccessToken")
          );
          axios
            .get("http://localhost:3000" + "/zoom/user", {
              headers: {
                atoken: this.state.tokendata.data.access_token,
              },
            })
            .then((result) => {
              this.setState({ userdata: result.data });
              // console.log(result.data);
              var url = process.env.REACT_APP_redirectURL + "/";
              window.location = url;
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
            {/* <div>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
          </div>
        )}
      </div>
    );
  }
}

export default zoomCallback;
