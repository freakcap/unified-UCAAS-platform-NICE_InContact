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
    slackuser: {},
    zoomtokenData: {},
    slacktokenData: {},
    zoomMessages: [],
    slackMessages: [],
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    showUserOptions: false,
    error: false,
    errorMessage: "",
    platformFlag: true, // true = zoom, false = slack
    currSlackUID: "", // User ID
    currSlackCID: "", // Channel ID
    zoomStatus: true,
    slackStatus: true,
    targetUserStatus: true,
  };

  componentDidMount() {
    // Get tokens for local storage
    const zoomTokens = localStorage.getItem("ZoomAccessToken");
    const slackTokens = localStorage.getItem("SlackAccessToken");
    if (zoomTokens != null && slackTokens != null) {
      this.setState(
        { zoomtokenData: zoomTokens, slacktokenData: slackTokens },
        () => {
          this.checkZoomLoginStatus();
          this.checkSlackLoginStatus();
        }
      );
    } else {
      localStorage.clear();
      var url = process.env.REACT_APP_redirectURL + "/";
      window.location = url;
    }
  }

  /* Fetch Contacts from Address Book */
  fetchContacts() {
    axios
      .get("http://localhost:3000" + "/addressbook/contacts", {})
      .then((result) => {
        this.setState({ userChatData: result.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Check zoom login */
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
          this.fetchContacts();
        }
        // code: 124, message: "Invalid access token."
      })
      .catch((error) => {
        console.log(error);
        localStorage.clear();
        var url = process.env.REACT_APP_redirectURL + "/zoomAuth";
        window.location = url;
      });
  };

  /* Check Slack login */
  checkSlackLoginStatus = () => {
    let usrid = localStorage.getItem("SlackUserID");
    axios
      .get("http://localhost:3000" + "/slack/me", {
        headers: {
          atoken: this.state.slacktokenData,
          uid: usrid,
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
          this.fetchContacts();
        }
        // code: 124, message: "Invalid access token."
      })
      .catch((error) => {
        console.log(error);
        localStorage.clear();
        var url = process.env.REACT_APP_redirectURL + "/";
        window.location = url;
      });
  };

  /* Converts zoom message into required message */
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

  /* Converts slack message into required message */
  myMsgsSlack(msg) {
    if (msg.user == this.receiver) {
      msg.position = "left";
    } else {
      msg.position = "right";
    }
    msg.type = "text";
    msg.date = parseInt(msg.ts) * 1000;
    msg.text = msg.text;
    return msg;
  }

  /* Fetch Zoom messages */
  getMessagesZoom = () => {
    axios
      .get("http://localhost:3000" + "/zoom/messages", {
        headers: {
          atoken: this.state.zoomtokenData,
          id: this.state.user.id,
          to: this.state.selectedUserIndex.user.zoom.email,
          dt: "2021-03-18",
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

  /* Get Slack target details UID and CID */
  getSlackTargetDetails() {
    axios
      .get("http://localhost:3000" + "/slack/user", {
        headers: {
          atoken: this.state.slacktokenData,
          mailid: this.state.selectedUserIndex.user.slack.email,
        },
      })
      .then((result) => {
        this.setState({ currSlackUID: result.data.user.id }, () => {
          axios
            .get("http://localhost:3000" + "/slack/openconversation", {
              headers: {
                atoken: this.state.slacktokenData,
                userid: this.state.currSlackUID,
              },
            })
            .then((res) => {
              this.setState({ currSlackCID: res.data.channel.id }, () => {});
            })
            .catch((error) => {
              console.log(error);
              // this.authenticate();
            });
        });
      })
      .catch((error) => {
        console.log(error);
        // this.authenticate();
      });
  }

  /* Fetch Slack messages */
  getMessagesSlack = () => {
    axios
      .get("http://localhost:3000" + "/slack/messages", {
        headers: {
          atoken: this.state.slacktokenData,
          cid: this.state.currSlackCID,
        },
      })
      .then((result) => {
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

  /* Poll zoom messages */
  getMessagesIntervalZoom = () => {
    if (
      !this.state.platformFlag ||
      this.state.selectedUserIndex.user.zoom.email === "na"
    )
      return;
    const interval = setInterval(() => {
      if (!this.state.platformFlag) return;
      this.getMessagesZoom();
    }, 4000);
  };

  /* Poll slack messages */
  getMessagesIntervalSlack = () => {
    if (
      this.state.platformFlag ||
      this.state.selectedUserIndex.user.slack.email === "na"
    )
      return;
    var uid;
    this.getSlackTargetDetails();

    const interval = setInterval(() => {
      if (this.state.platformFlag) return;
      this.getMessagesSlack();
    }, 4000);
  };

  /* Poll user status */
  checkUserStatusInterval = () => {
    const interval = setInterval(() => {
      this.checkUserStatus();
    }, 5000);
  };

  /* Check user presence status */
  checkUserStatus = () => {
    if (this.state.selectedUserIndex.user.zoom.email !== "na") {
      // replace with server uri
      axios
        .get("http://localhost:3000" + "/zoom/status", {
          headers: {
            atoken: this.state.zoomtokenData,
            uid: this.state.selectedUserIndex.user.zoom.email,
          },
        })
        .then((result) => {
          if (result.data.presence_status == "Available")
            this.setState({ zoomStatus: true });
          else this.setState({ zoomStatus: false });

          if (this.state.zoomStatus && this.state.slackStatus) {
            this.setState({ targetUserStatus: true });
          } else {
            this.setState({ targetUserStatus: false });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (this.state.selectedUserIndex.user.slack.email !== "na") {
      // Replace with server uri
      axios
        .get("http://localhost:3000" + "/slack/user", {
          headers: {
            atoken: this.state.slacktokenData,
            mailid: this.state.selectedUserIndex.user.slack.email,
          },
        })
        .then((result) => {
          this.setState({ currSlackUID: result.data.user.id }, () => {
            // Replace with server uri
            axios
              .get("http://localhost:3000" + "/slack/status", {
                headers: {
                  atoken: this.state.slacktokenData,
                  uid: this.state.currSlackUID,
                },
              })
              .then((result) => {
                if (result.data.presence == "active")
                  this.setState({ slackStatus: true });
                else this.setState({ slackStatus: false });
                if (this.state.zoomStatus && this.state.slackStatus) {
                  this.setState({ targetUserStatus: true });
                } else {
                  this.setState({ targetUserStatus: false });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  onChatClicked(e) {
    this.toggleViews();
    let users = this.state.userChatData.Items;
    this.setState(
      {
        selectedUserIndex: e,
        showUserOptions: false,
        platformFlag: true,
        zoomMessages: [],
        slackMessages: [],
        zoomStatus: true,
        slackStatus: true,
        targetUserStatus: true,
        currSlackUID: "",
        currSlackCID: "",
      },
      () => {
        this.checkUserStatusInterval();
        this.getMessagesIntervalZoom();
        this.getMessagesIntervalSlack();
      }
    );
    return;
  }

  /* Send message zoom */
  sendZoomMessage(message) {
    var data = {
      message: message.text,
      to: message.to,
    };
    // Replace with server uri
    axios
      .post("http://localhost:3000" + "/zoom/sendmessage", data, {
        headers: {
          atoken: this.state.zoomtokenData,
          id: this.state.user.id,
        },
      })
      .then((result) => {
        this.getMessagesZoom();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Send message slack */
  sendSlackMessage(message) {
    var data = {
      message: message.text,
      to: message.to,
    };
    // Replace with server uri
    axios
      .post("http://localhost:3000" + "/slack/sendmessage", data, {
        headers: {
          atoken: this.state.slacktokenData,
        },
      })
      .then((result) => {
        this.getMessagesSlack();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Creates message in required format for sending */
  createMessage(text) {
    let message = {
      type: "text",
      text: text,
      date: +new Date(),
      className: "message",
      position: "right",
      to: this.state.platformFlag
        ? this.state.selectedUserIndex.user.zoom.email
        : this.state.currSlackUID,
    };
    this.state.platformFlag
      ? this.sendZoomMessage(message)
      : this.sendSlackMessage(message);
  }

  /* To make responsive */
  toggleViews() {
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList,
    });
  }

  /* Toggle for adding user */
  toggleUserOptionView() {
    this.setState({
      showUserOptions: !this.state.showUserOptions,
    });
  }

  /* Toggle to switch platforms */
  togglePlatforms() {
    this.setState(
      {
        platformFlag: !this.state.platformFlag,
      },
      () => {
        if (this.state.platformFlag) {
          this.getMessagesIntervalZoom();
        } else {
          this.getMessagesIntervalSlack();
        }
      }
    );
  }

  render() {
    console.log(this.state.zoomtokenData);
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
                  {this.state.showUserOptions ? (
                    <AddUser
                      onBackPressed={this.toggleUserOptionView.bind(this)}
                      refreshOnAdd={this.fetchContacts.bind(this)}
                    />
                  ) : (
                    <>
                      {this.state.platformFlag ? (
                        <ChatBox
                          signedInUser={this.state.user}
                          messages={this.state.zoomMessages}
                          onSendClicked={this.createMessage.bind(this)}
                          onBackPressed={this.toggleViews.bind(this)}
                          onSwitch={this.togglePlatforms.bind(this)}
                          targetUser={this.state.selectedUserIndex}
                          targetStatus={this.state.targetUserStatus}
                          platform="zoom"
                        />
                      ) : (
                        <ChatBox
                          signedInUser={this.state.slackuser}
                          messages={this.state.slackMessages}
                          onSendClicked={this.createMessage.bind(this)}
                          onBackPressed={this.toggleViews.bind(this)}
                          onSwitch={this.togglePlatforms.bind(this)}
                          targetUser={this.state.selectedUserIndex}
                          targetStatus={this.state.targetUserStatus}
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
