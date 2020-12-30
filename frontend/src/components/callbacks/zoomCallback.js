import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";

class zoomCallback extends Component {
  state = {
    tokendata: {},
    userdata:{},
  };

  authenticate() {
    const value = queryString.parse(this.props.location.search);
    console.log("Yo working");
    // console.log(
    //   Buffer.from(
    //     `${process.env.REACT_APP_clientID}:${process.env.REACT_APP_clientSecret}`
    //   ).toString("base64")
    // );
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
          localStorage.setItem('AccessToken', this.state.tokendata.data.access_token);
          console.log("LOCAL_Callback",localStorage.getItem('AccessToken'));
          axios
            .get("http://localhost:3000" + "/zoom/user", {
              headers: {
                atoken: this.state.tokendata.data.access_token,
              },
            })
            .then((result) => {
              this.setState({ userdata: result.data });
              // console.log(result.data);
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
        {this.state.userdata.first_name ? (
          <div>
            <div>
              <div>
                {/* <img src="${this.state.userdata.data.pic_url}" alt="User photo" /> */}
                <div>
                  <h1>Hello</h1>
                  <h2>
                    {this.state.userdata.first_name.toString()} {this.state.userdata.last_name.toString()}
                  </h2>
                  {/* <p>
                    ${this.state.userdata.role_name}, ${this.state.userdata.company}
                  </p> */}
                </div>
              </div>
              {/* <div class="response">
                <h4>DATA : </h4>
                <a
                  href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user"
                  target="_blank"
                >
                  API Reference
                </a>
                {this.state.userdata}
                </div> */}
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

export default zoomCallback;
