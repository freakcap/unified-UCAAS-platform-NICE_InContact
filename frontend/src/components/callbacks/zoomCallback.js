import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";

class zoomCallback extends Component {
  authenticate() {
    const value=queryString.parse(this.props.location.search);
    console.log("Yo working");
    console.log(Buffer.from(`${process.env.REACT_APP_clientID}:${process.env.REACT_APP_clientSecret}`).toString('base64'));
    if(value.code){
      axios.get(process.env.serverURI + "/auth",{
        data :{
          code : value.code
        }
      })
      .then((res)=>{return res.json()})
      .then((res)=>{console.log(res)});
    }
    else{
      console.log("fiss");
    }
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

export default zoomCallback;
