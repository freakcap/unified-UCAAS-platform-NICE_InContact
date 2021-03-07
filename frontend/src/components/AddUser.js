import React, { Component } from "react";
import "./AddUser.css";
// import Button from "react-bootstrap/Button";
import {
  Navbar as NavbarComponent,
} from "react-chat-elements";
import axios from "axios";

/**
 *
 * AddUser Component
 *
 * To add a user to the addressbook
 * 
 */

export default class AddUser extends Component {
  state = {
    userid: "",
    first_name: "",
    last_name: "",
    zoom : {
        email : ""
    },
    slack : {
      email : ""
    }
  };
  /**
   *
   * Sends a message only if it is not falsy.
   */

  onAddClicked() {
    this.props.onSendClicked(this.state.messageText);
    this.setState({ messageText: "" });
  }
 
  inputCheck = (e) => {
    let filter = e.target.getAttribute('filter')   
    e.target.value = e.target.value.replace(new RegExp(filter, 'g'), '')   
    this.setState({[e.target.name]: e.target.value})
  }

  submitCheck = () => {
    if(!this.state.first_name || !this.state.last_name){
      alert("A name field is empty.");
      return;
    } else if(!this.state.userid){
        alert("Userid cannot be empty.");
        return;
    }
    //add user here
    axios
      .post("http://localhost:3000" + "/addressbook/add", {
        userid : this.state.userid,
        firstname : this.state.first_name,
        lastname : this.state.last_name,
        zoom : {
            email : this.state.zoom.email
        },
        slack : {
          email : this.state.slack.email
        }
      })
      .then((result) => {
          console.log(result);
          if(result.status == 200) alert("User added successfully.");
          else alert("User not added");
          this.resetForm();
      })
      .catch((error) => {
        alert("User not added.");
        this.resetForm();
      });
 }

 toggleViews(){
     this.props.onBackPressed();
 }

 resetForm = () => {
    this.setState({
        userid: "",
        first_name: "",
        last_name: "",
        zoom : {
            email : ""
        },
        slack : {
          email : ""
        }
    })    
  }

  render() {
    // console.log("Target",this.props.targetUser);
    return (
      <div>
          <NavbarComponent
              left={
                <div>
                  <p className="navBarText">
                    ADD A NEW USER
                  </p>
                </div>
              }
            />
            <div className="addUserBody">
            <div className="userForm">
                <div className="header">
                <p>Fill in the below details :</p>
            </div>
          <div className="inputcontainer">
            <input className="userInput" filter="[^a-zA-Z ]" name="first_name" placeholder="First Name" onChange={this.inputCheck} value={this.state.first_name} />
            <input className="userInput" filter="[^a-zA-Z ]" name="last_name" placeholder="Last Name" onChange={this.inputCheck} value={this.state.last_name} />
            <input className="userInput" name="userid" placeholder="Userid" onChange={this.inputCheck} value={this.state.userid} />
            <input className="userInput" placeholder="Zoom Email Address" onChange={(e) => {this.setState({zoom:{email: e.target.value}})}} value={this.state.zoom.email}/>
            <input className="userInput" placeholder="Slack Email Address" onChange={(e) => {this.setState({slack:{email: e.target.value}})}} value={this.state.slack.email}/>
            <button className="userButton" onClick={this.submitCheck}>Submit</button>
            <button className="userButton" onClick={this.resetForm}>Reset</button>
          </div>
          </div>
        </div>
      </div>
    );
  }
}
