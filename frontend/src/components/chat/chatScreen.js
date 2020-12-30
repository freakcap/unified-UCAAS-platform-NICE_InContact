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
    // users: [
    //   {
    //     id: 1,
    //     name: "Niraj",
    //   },
    //   {
    //     id: 2,
    //     name: "Pranav",
    //   },
    //   {
    //     id: 3,
    //     name: "Yash",
    //   },
    //   {
    //     id: 4,
    //     name: "Mark",
    //   },
    //   {
    //     id: 5,
    //     name: "Bill",
    //   },
    //   {
    //     id: 6,
    //     name: "Sam",
    //   },
    //   {
    //     id: 7,
    //     name: "Rohit",
    //   },
    // ], // Avaiable users for signing-in
    userChatData: [
      {
        id: 2,
        name: "Pranav",
        messages: [],
      },
      {
        id: 3,
        name: "Yash",
        messages: [],
      },
      {
        id: 4,
        name: "Mark",
        messages: [],
      },
      {
        id: 5,
        name: "Bill",
        messages: [],
      },
      {
        id: 6,
        name: "Sam",
        messages: [],
      },
      {
        id: 7,
        name: "Rohit",
        messages: [],
      },
    ], // this contains users from which signed-in user can chat and its message data.
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
          atoken: this.props.location.aboutProps.tokendata.data.access_token,
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
  componentDidMount() {
    console.log(this.props.location.aboutProps.tokendata);
    this.setState({ user: this.props.location.aboutProps.userdata });
    this.fetchContacts();
  }
  onChatClicked(e) {
    this.toggleViews();
    let users = this.state.userChatData;
    for (let index = 0; index < users.length; index++) {
      if (users[index].id === e.user.id) {
        // users[index].unread = 0;
        this.setState({ selectedUserIndex: index, userChatData: users });
        return;
      }
    }
  }
  createMessage(text) {
    console.log("text", text);
    let userChatData = this.state.userChatData;
    let message = {
      to: this.state.userChatData[this.state.selectedUserIndex].id,
      type: "text",
      text: text,
      date: +new Date(),
      className: "message",
      position: "right",
      from: this.state.user.id,
    };
    console.log(userChatData);
    userChatData[
      this.state.userChatData[this.state.selectedUserIndex].id - 2
    ].messages.push(message);
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

export default chatScreen;
