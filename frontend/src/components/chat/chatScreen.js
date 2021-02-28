import React, { Component } from "react";
import NavBar from "../NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserList from "../UserList";
import ChatBox from "../ChatBox";
import AddUser from "../AddUser";
import ErrorModal from "../ErrorModal";
import LoadingModal from "../LoadingModal";
import "react-chat-elements/dist/main.css";
// import { fetchUsers } from "./requests";
import Loader from "react-loader-spinner";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";

class chatScreen extends Component {
  state = {
    signInModalShow: false,
    userChatData: {}, // this contains users from which signed-in user can chat and its message data.
    user: {}, // Signed-In User
    tokenData: {},
    messages: [],
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    showUserOptions: false,
    error: false,
    errorMessage: "",
  };
  fetchContacts() {
    // // console.log(this.state.tokenData);
    // axios
    //   .get("http://localhost:3000" + "/zoom/contacts", {
    //     headers: {
    //       atoken: this.state.tokenData,
    //     },
    //   })
    //   .then((result) => {
    //     this.setState({ userChatData: result.data });
    //     // console.log(result.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // console.log(this.state.tokenData);
    axios
      .get("http://localhost:3000" + "/addressbook/contacts", {
      })
      .then((result) => {
        this.setState({ userChatData: result.data });
        // console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
      console.log("CHAT", this.state.userChatData);
  }
  checkLoginStatus = () => {
    axios
      .get("http://localhost:3000" + "/zoom/user", {
        headers: {
          atoken: this.state.tokenData,
        },
      })
      .then((result) => {
        if (result.data.code == 124) {
          console.log("error");
          localStorage.clear();
          var url = process.env.REACT_APP_redirectURL + "/";
          window.location = url;
        } else {
          this.setState({ user: result.data });
          // this.setState({ user: this.props.location.aboutProps.userdata });
          this.fetchContacts();
        }
        console.log(result.data);
        // code: 124, message: "Invalid access token."
      })
      .catch((error) => {
        console.log(error);
        localStorage.clear();
        var url = process.env.REACT_APP_redirectURL + "/";
        window.location = url;
      });
  };

  componentDidMount() {
    const tokens = localStorage.getItem("AccessToken");
    if (tokens != null) {
      this.setState({ tokenData: tokens }, () => {
        this.checkLoginStatus();
      });
    } else {
      localStorage.clear();
      var url = process.env.REACT_APP_redirectURL + "/";
      window.location = url;
    }
  }

  myMsgs(msg) {
    if (msg.sender == this.sender) {
      msg.position = "right";
    } else {
      msg.position = "left";
    }
    msg.type = "text";
    msg.date = msg.timestamp;
    msg.text = msg.message;
    return msg;
  }

  getMessages = () => {
    axios
      .get("http://localhost:3000" + "/zoom/messages", {
        headers: {
          atoken: this.state.tokenData,
          id: this.state.user.id,
          to: this.state.selectedUserIndex.user.zoom.email,
          dt: "2021-01-11",
        },
      })
      .then((result) => {
        var sender = this.state.user.email;
        var msgs = result.data.messages.map(this.myMsgs, {
          sender: sender,
        });
        msgs = msgs.reverse();
        this.setState({ messages: msgs });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getMessagesInterval = () => {
    const interval = setInterval(() => {
      this.getMessages();
    }, 4000);
  };


  onChatClicked(e) {
    this.toggleViews();
    this.setState({
      showUserOptions : false
    });
    let users = this.state.userChatData.Items;
    this.setState({ selectedUserIndex: e }, () => {
      // console.log("dbg",this.state.selectedUserIndex);
      this.getMessagesInterval();
    });
    return;
  }
  
  sendMessage(message) {
    console.log("To", message.to);
    var data = {
      message: message.text,
      to: message.to,
    };
    axios
      .post("http://localhost:3000" + "/zoom/sendmessage", data, {
        headers: {
          atoken: this.state.tokenData,
          id: this.state.user.id,
        },
      })
      .then((result) => {
        console.log("Send", result);
        this.getMessages();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  createMessage(text) {
    let message = {
      type: "text",
      text: text,
      date: +new Date(),
      className: "message",
      position: "right",
      to: this.state.selectedUserIndex.user.zoom.email,
    };
    this.sendMessage(message);
  }
  toggleViews() {
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList,
    });
  }

  toggleUserOptionView() {
    this.setState({
      showUserOptions: !this.state.showUserOptions
    });
  }

  render() {
    let chatBoxProps = this.state.showChatBox
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xsHidden: true,
          // smHidden: true,
        };

    let chatListProps = this.state.showChatList
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xsHidden: true,
          // smHidden: true,
        };
    return (
      <div>
        {this.state.userChatData.Items ? (
          <div>
            <NavBar signedInUser={this.state.user} />
            <Container>
              <Row>
                <Col {...chatListProps} md={4}>
                  <UserList
                    userData={this.state.userChatData.Items}
                    onChatClicked={this.onChatClicked.bind(this)}
                    toggleUserOptionView={this.toggleUserOptionView.bind(this)}
                  />
                </Col>
                <Col {...chatBoxProps} md={8}>
                  { this.state.showUserOptions ? (
                    <AddUser 
                      onBackPressed={this.toggleUserOptionView.bind(this)}
                    />
                  ) : (
                    <ChatBox
                      signedInUser={this.state.user}
                      messages={this.state.messages}
                      onSendClicked={this.createMessage.bind(this)}
                      onBackPressed={this.toggleViews.bind(this)}
                      targetUser={this.state.selectedUserIndex}
                  />
                  )}
                </Col>
              </Row>
            </Container>
            <ErrorModal
              show={this.state.error}
              errorMessage={this.state.errorMessage}
            />
            <LoadingModal show={this.state.loading} />
            <NotificationContainer />
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

export default chatScreen;
