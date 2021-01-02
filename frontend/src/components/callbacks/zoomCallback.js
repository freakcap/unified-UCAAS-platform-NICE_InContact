import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import { Link } from "react-router-dom"; 

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
            "AccessToken",
            this.state.tokendata.data.access_token
          );
          console.log("LOCAL_Callback", localStorage.getItem("AccessToken"));
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
                <div>
                  <h1>Hello</h1>
                  <h2>
                    {this.state.userdata.first_name.toString()}{" "}
                    {this.state.userdata.last_name.toString()}
                  </h2>
                </div>
              </div>
              <Link to={{pathname :"/chat" ,aboutProps:{userdata:this.state.userdata, tokendata : this.state.tokendata}}} className="btn btn-primary">
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

export default zoomCallback;
