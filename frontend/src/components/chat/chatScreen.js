import React, { Component } from "react";
import NavBar from "../NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserList from "../UserList";
import ChatBox from "../ChatBox";
import ErrorModal from "../ErrorModal";
import LoadingModal from "../LoadingModal";
import "react-chat-elements/dist/main.css";
// import { fetchUsers } from "./requests";

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
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    error: false,
    errorMessage: "",
  };
  fetchContacts() {
    console.log(this.state.tokenData);
    axios
      .get("http://localhost:3000" + "/zoom/contacts", {
        headers: {
          atoken: this.state.tokenData,
        },
      })
      .then((result) => {
        this.setState({ userChatData: result.data });
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
    // console.log(localStorage.getItem("AccessToken"));
    const tokens = localStorage.getItem("AccessToken");
    if (tokens != null) {
      // console.log("CHAT_Login", localStorage.getItem("AccessToken"));
      // console.log("Tokens", tokens);
      this.setState({ tokenData: tokens }, () => {
        this.checkLoginStatus();
      });
    } else {
      localStorage.clear();
      var url = process.env.REACT_APP_redirectURL + "/";
      window.location = url;
    }
  }
  getMessages() {
    console.log("User",this.state.user.id)
    axios
      .get("http://localhost:3000" + "/zoom/messages", {
        headers: {
          atoken: this.state.tokenData,
          id: this.state.user.id,
          to: this.state.selectedUserIndex.user.email,
        },
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onChatClicked(e) {
    this.toggleViews();
    console.log("Selected User", e);
    let users = this.state.userChatData.contacts;
    this.setState({ selectedUserIndex: e }, () => {
      this.getMessages();
    });
    return;
  }
  createMessage(text) {
    console.log("text", text);
    let userChatData = this.state.userChatData;
    let message = {
      to: this.state.selectedUserIndex.user.email,
      type: "text",
      text: text,
      date: +new Date(),
      className: "message",
      position: "right",
      from: this.state.user.id,
    };
    console.log(userChatData);
    // userChatData[
    //   this.state.userChatData[this.state.selectedUserIndex].id - 2
    // ].messages.push(message);
    this.setState({ userChatData });
  }
  toggleViews() {
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList,
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
          smHidden: true,
        };

    let chatListProps = this.state.showChatList
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xsHidden: true,
          smHidden: true,
        };
    return (
      <div>
        {this.state.userChatData.contacts ? (
          <div>
            <NavBar signedInUser={this.state.user} />
            <Container>
              <Row>
                <Col {...chatListProps} md={4}>
                  <UserList
                    userData={this.state.userChatData}
                    onChatClicked={this.onChatClicked.bind(this)}
                  />
                </Col>
                <Col {...chatBoxProps} md={8}>
                  <ChatBox
                    signedInUser={this.state.user}
                    onSendClicked={this.createMessage.bind(this)}
                    onBackPressed={this.toggleViews.bind(this)}
                    targetUser={this.state.selectedUserIndex}
                  />
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
          <div></div>
        )}
      </div>
    );
  }
}

export default chatScreen;
