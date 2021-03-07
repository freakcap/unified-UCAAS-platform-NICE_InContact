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
    slackuser:{},
    zoomtokenData: {},
    slacktokenData : {},
    zoomMessages: [],
    slackMessages: [],
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    showUserOptions: false,
    error: false,
    errorMessage: "",
    platformFlag : false, // true = zoom, false = slack
    currSlackUID : "", // User ID
    currSlackCID : "", // Channel ID
  };

  fetchContacts() {
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

  checkZoomLoginStatus = () => {
    axios
      .get("http://localhost:3000" + "/zoom/user", {
        headers: {
          atoken: this.state.zoomtokenData,
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
        var url = process.env.REACT_APP_redirectURL + "/zoomAuth";
        window.location = url;
      });
  };

  checkSlackLoginStatus = () => {
    let usrid = localStorage.getItem("SlackUserID");
    axios
      .get("http://localhost:3000" + "/slack/me", {
        headers: {
          atoken: this.state.zoomtokenData,
          uid : usrid
        },
      })
      .then((result) => {
        if (result.data.ok == "false") {
          console.log("error");
          localStorage.clear();
          var url = process.env.REACT_APP_redirectURL + "/slackAuth";
          window.location = url;
        } else {
          this.setState({ slackuser: result.data });
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
    const zoomTokens = localStorage.getItem("ZoomAccessToken");
    const slackTokens = localStorage.getItem("SlackAccessToken");
    if(this.state.platformFlag){
      if(zoomTokens != null){
        this.setState({zoomtokenData : zoomTokens}, () => {
          this.checkZoomLoginStatus();
        });
      }
      else {
        let url = process.env.REACT_APP_redirectURL + "/zoomAuth";
        window.location = url;
      }
    }
    else if(slackTokens != null){
      this.setState({slacktokenData : slackTokens}, () => {
        this.checkSlackLoginStatus();
      });
    }
    else{
      localStorage.clear();
      let url = process.env.REACT_APP_redirectURL + "/slackAuth";
      window.location = url;
    }
    // // if (zoomTokens != null && slackTokens !=null) {
    //   console.log(slackTokens);
    //   if (slackTokens !=null) {
    //   // this.setState({ zoomtokenData: zoomTokens, slacktokenData:slackTokens }, () => {
    //     this.setState({ slacktokenData:slackTokens }, () => {
    //     // this.checkZoomLoginStatus();
    //     this.checkSlackLoginStatus();
    //   });
    // } else {
    //   localStorage.clear();
    //   var url = process.env.REACT_APP_redirectURL + "/";
    //   window.location = url;
    // }
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

  myMsgsSlack(msg){
    if (msg.user == this.receiver) {
      msg.position = "left";
    } else {
      msg.position = "right";
    }
    msg.type = "text";
    msg.date = parseInt(msg.ts);
    msg.text = msg.text;
    return msg;
  }

  getMessagesZoom = () => {
    axios
      .get("http://localhost:3000" + "/zoom/messages", {
        headers: {
          atoken: this.state.zoomtokenData,
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
        this.setState({ zoomMessages: msgs });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getSlackTargetDetails(){
      axios
      .get("http://localhost:3000" + "/slack/user", {
        headers: {
          atoken: this.state.slacktokenData,
          mailid : this.state.selectedUserIndex.user.slack.email,
        },
      })
      .then((result) => {
        this.setState({ currSlackUID: result.data.user.id },() => {
          console.log(this.state.currSlackUID);
          axios
          .get("http://localhost:3000" + "/slack/openconversation", {
            headers: {
              atoken: this.state.slacktokenData,
              userid : this.state.currSlackUID,
            },
          })
          .then((res) => {
            console.log(res);
            this.setState({currSlackCID : res.data.channel.id}, () => {});
          })
          .catch((error) => {
            console.log(error);
            // this.authenticate();
          });  
        });
        // console.log(result.data.user);
      })
      .catch((error) => {
        console.log(error);
        // this.authenticate();
      });  
  };

  getMessagesSlack = () => {
    axios
      .get("http://localhost:3000" + "/slack/messages", {
        headers: {
          atoken: this.state.slacktokenData,
          cid: this.state.currSlackCID,
        },
      })
      .then((result) => {
        console.log(result);
        var receiver = this.state.currSlackUID;
        var msgs = result.data.messages.map(this.myMsgsSlack, {
          receiver: receiver,
        });
        msgs = msgs.reverse();
        this.setState({ slackMessages: msgs });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getMessagesIntervalZoom = () => {
    if(!this.state.platformFlag) return;
    const interval = setInterval(() => {
      this.getMessagesZoom();
    }, 4000);
  };
  getMessagesIntervalSlack = () => {
    if(this.state.platformFlag) return;
    var uid;
    this.getSlackTargetDetails();
    
    const interval = setInterval(() => {
      this.getMessagesSlack();
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
      this.getMessagesIntervalZoom();
      // this.getChannelId();//Pending
      this.getMessagesIntervalSlack();
    });
    return;
  }
  
  sendZoomMessage(message) {
    console.log("To", message.to);
    var data = {
      message: message.text,
      to: message.to,
    };
    axios
      .post("http://localhost:3000" + "/zoom/sendmessage", data, {
        headers: {
          atoken: this.state.zoomtokenData,
          id: this.state.user.id,
        },
      })
      .then((result) => {
        console.log("Send", result);
        this.getMessagesZoom();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendSlackMessage(message) {
    console.log("To", message.to);
    var data = {
      message: message.text,
      to: message.to,
    };
    axios
      .post("http://localhost:3000" + "/slack/sendmessage", data, {
        headers: {
          atoken: this.state.slacktokenData,
        },
      })
      .then((result) => {
        console.log("Send", result);
        this.getMessagesSlack();
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
      to: this.state.platformFlag ? this.state.selectedUserIndex.user.zoom.email : this.state.currSlackUID,
    };
    this.state.platformFlag ? this.sendZoomMessage(message) : this.sendSlackMessage(message);
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

  togglePlatforms(){
    this.setState({
      platformFlag : !this.state.platformFlag
    });
  }

  render() {
    let chatBoxProps = this.state.showChatBox ? {
          xs: 12, sm: 12,
        }:{ 
          xsHidden: true,
          // smHidden: true,
        };

    let chatListProps = this.state.showChatList ? {
          xs: 12, sm: 12,
        } : {
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
                    <>
                        { this.state.platformFlag ? (
                          <ChatBox
                          signedInUser={this.state.user}
                          messages={this.state.zoomMessages}
                          onSendClicked={this.createMessage.bind(this)}
                          onBackPressed={this.toggleViews.bind(this)}
                          targetUser={this.state.selectedUserIndex}
                          platform="zoom"
                      />
                        ):(
                          <ChatBox
                          signedInUser={this.state.slackuser}
                          messages={this.state.slackMessages}
                          onSendClicked={this.createMessage.bind(this)}
                          onBackPressed={this.toggleViews.bind(this)}
                          targetUser={this.state.selectedUserIndex}
                          platform="slack"
                      />
                        )}
                    </>
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
