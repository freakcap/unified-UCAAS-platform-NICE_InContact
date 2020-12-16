import "./App.css";
import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserList from "./components/UserList";
import ChatBox from "./components/ChatBox";
import ErrorModal from "./components/ErrorModal";
import LoadingModal from "./components/LoadingModal";
import "react-chat-elements/dist/main.css";
import "./index.css";
// import { fetchUsers } from "./requests";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";

class App extends Component {
  state = {
    signInModalShow: false,
    users: [
      {
        id: 1,
        name: "Niraj",
      },
      {
        id: 2,
        name: "Pranav",
      },
      {
        id: 3,
        name: "Yash",
      },
      {
        id: 4,
        name: "Mark",
      },
      {
        id: 5,
        name: "Bill",
      },
      {
        id: 6,
        name: "Sam",
      },
      {
        id: 7,
        name: "Rohit",
      },
    ], // Avaiable users for signing-in
    userChatData: [
      {
        id: 2,
        name: "Pranav",
      },
      {
        id: 3,
        name: "Yash",
      },
      {
        id: 4,
        name: "Mark",
      },
      {
        id: 5,
        name: "Bill",
      },
      {
        id: 6,
        name: "Sam",
      },
      {
        id: 7,
        name: "Rohit",
      },
    ], // this contains users from which signed-in user can chat and its message data.
    user: {
      id: 1,
      name: "Niraj",
    }, // Signed-In User
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    error: false,
    errorMessage: "",
  };
  // componentDidMount() {
  //   fetchUsers().then((users) => this.setState({ users }));
  // }
  onChatClicked(e) {
    console.log("Clicked");
    this.toggleViews();
    let users = this.state.userChatData;
    for (let index = 0; index < users.length; index++) {
      if (users[index].id === e.user.id) {
        // users[index].unread = 0;
        this.setState({ selectedUserIndex: index, userChatData: users });
        console.log(index)
        return;
      }
    }
  }
  createMessage(text) {
    let message = {
      to: this.state.userChatData[this.state.selectedUserIndex].id,
      message: {
        type: "text",
        text: text,
        date: +new Date(),
        className: "message",
      },
      from: this.state.user.id,
    };
  }
  toggleViews() {

    console.log("Toggled");
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList,
    });
  }
  render() {let chatBoxProps = this.state.showChatBox
    ? {
        xs: 12,
        sm: 12
      }
    : {
        xsHidden: true,
        smHidden: true
      };

  let chatListProps = this.state.showChatList
    ? {
        xs: 12,
        sm: 12
      }
    : {
        xsHidden: true,
        smHidden: true
      };
    return (
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
                targetUser={
                  this.state.userChatData[this.state.selectedUserIndex]
                }
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
    );
  }
}

export default App;
