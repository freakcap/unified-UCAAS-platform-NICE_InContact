import React, { Component } from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/FormGroup";
// import Col from "react-bootstrap/lib/Col";
import Loader from "react-loader-spinner";
import Jumbotron from "react-bootstrap/Jumbotron";
import {
  MessageList,
  Navbar as NavbarComponent,
  Avatar,
} from "react-chat-elements";
import axios from "axios";

export default class ChatBox extends Component {
  state = {
    messageText: "",
    messages: {},
    tokenData: {},
  };

  onSendClicked() {
    if (!this.state.messageText) {
      return;
    }
    this.props.onSendClicked(this.state.messageText);
    this.setState({ messageText: "" });
  }
  onMessageInputChange(e) {
    this.setState({ messageText: e.target.value });
  }
  /**
   *
   * @param {KeyboardEvent} e
   *
   * listen for enter pressed and sends the message.
   */
  onMessageKeyPress(e) {
    if (e.key === "Enter") {
      this.onSendClicked();
    }
  }

  render() {
    return (
      <div>
        {this.props.targetUser ? (
          <div>
            <NavbarComponent
              left={
                <div>
                  <Avatar
                    src={`https://houstontamilchair.org/wp-content/uploads/2020/07/parent-directory-avatar-2png-avatar-png-256_256.png`}
                    alt={"image"}
                    size="large"
                    type="circle flexible"
                  />
                  <p className="navBarText">
                    {this.props.targetUser.user.first_name +
                      " " +
                      this.props.targetUser.user.last_name}
                  </p>
                </div>
              }
              center={
                <div>
                  <p className="navBarText">
                    <span> Platform : {this.props.platform}</span>
                    {this.props.targetStatus?(<span>- Sync Status : Active</span>):(<span>- Sync Status : Inactive</span>)}
                  </p>
                </div>
              }
              right={
                <div>
                  <Button
                    onClick={this.props.onSwitch}
                  >
                    Switch Platform
                  </Button>
                </div>
              }
            />
            {(this.props.platform === "slack" &&
              this.props.targetUser.user.slack.email === "na") ||
            (this.props.platform === "zoom" &&
              this.props.targetUser.user.zoom.email === "na") ? (
              <div style={{marginTop:'10px'}}>
                <h3>User not available on this platform.</h3>
              </div>
            ) : (
              <>
                {this.props.messages.length == 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                    }}
                  >
                    <Loader
                      type="TailSpin"
                      color="#00BFFF"
                      height={100}
                      width={100}
                    />
                  </div>
                ) : (
                  <>
                    <MessageList
                      className="message-list"
                      lockable={true}
                      toBottomHeight={"100%"}
                      dataSource={this.props.messages}
                    />
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type="text"
                          value={this.state.messageText}
                          onChange={this.onMessageInputChange.bind(this)}
                          onKeyPress={this.onMessageKeyPress.bind(this)}
                          placeholder="Type a message here (Limit 3000 characters)..."
                          ref="messageTextBox"
                          className="messageTextBox"
                          maxLength="3000"
                          autoFocus
                        />
                        <Button>
                          <Button
                            disabled={!this.state.messageText}
                            className="sendButton"
                            onClick={this.onSendClicked.bind(this)}
                          >
                            Send
                          </Button>
                        </Button>
                      </InputGroup>
                    </FormGroup>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <Jumbotron>
              <h1>Hello, {(this.props.signedInUser || {}).first_name}!</h1>
              <p>Select a contact to start a chat.</p>
            </Jumbotron>
          </div>
        )}
      </div>
    );
  }
}
