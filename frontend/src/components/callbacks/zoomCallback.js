import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";

class zoomCallback extends Component {
  authenticate() {
    const value=queryString.parse(this.props.location.search);
    console.log("Yo working");
    console.log(Buffer.from(`${process.env.REACT_APP_clientID}:${process.env.REACT_APP_clientSecret}`).toString('base64'));
    if(value.code){
      // replace with server URI
      axios.get("http://localhost:3000" + "/zoom/auth",{
        headers :{
          authData: value.code.toString() 
        }
      })
      // .then((response)=>{return response.json()})
      .then((res)=>{console.log(res)})
      .catch((error)=>{console.log("caught")});
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
