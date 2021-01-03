import React, { Component } from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/FormGroup";
// import Col from "react-bootstrap/lib/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import {
  MessageList,
  Navbar as NavbarComponent,
  Avatar,
} from "react-chat-elements";
import axios from "axios";

/**
 *
 * ChatBox Component
 *
 * displays all the messages from chat history.
 * renders message text box for input.
 */

export default class ChatBox extends Component {
  state = {
    messageText: "",
    messages: {},
    tokenData: {},
  };
  /**
   *
   * Sends a message only if it is not falsy.
   */

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
    // console.log("Target",this.props.targetUser);
    return (
      <div>
        {this.props.targetUser ? (
          <div>
            <NavbarComponent
              left={
                <div>
                  <Avatar
                    src={`../static/images/avatar/${this.props.targetUser.id}.jpg`}
                    alt={"image"}
                    size="large"
                    type="circle flexible"
                  />
                  <p className="navBarText">
                    {this.props.targetUser.user.first_name}
                  </p>
                </div>
              }
            />
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={this.props.targetUser.messages}
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
          </div>
        ) : (
          <div>
            <Jumbotron>
              <h1>Hello, {(this.props.signedInUser || {}).name}!</h1>
              <p>Select a contact to start a chat.</p>
            </Jumbotron>
          </div>
        )}
      </div>
    );
  }
}
