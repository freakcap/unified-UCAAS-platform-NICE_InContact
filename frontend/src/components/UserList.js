import React, { Component } from "react";
import { ChatList } from "react-chat-elements";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";

/**
 *
 * Renders user list
 *
 * Used on both places Sign-in modal and as ChatList
 */

export default class UserList extends Component {
  state = {
    userData: [],
    searchQuery: null,
  };
  componentDidMount() {}
  searchInput(e) {
    let value = e.target.value;
    let searchQuery = null;
    if (value) {
      searchQuery = value;
    }
    this.setState({ searchQuery });
  }
  /**
   *
   * Implement filter logic on basis of search query.
   */
  getFilteredUserList() {
    return !this.state.searchQuery
      ? this.props.userData
      : this.props.userData.filter((user) =>
          user.first_name
            .toLowerCase()
            .includes(this.state.searchQuery.toLowerCase())
        );
  }

  toggleViews() {
    this.props.toggleUserOptionView();
  }

  render() {
    let users = this.props.userData;
    console.log("LIST", this.props.userData);
    return (
      <div>
        <FormGroup>
          {/* <FormControl
            type="text"
            placeholder="Search for a user here..."
            onInput={this.searchInput.bind(this)}
          /> */}
        </FormGroup>
        <Button
          variant="primary"
          size="lg"
          block
          active
          className="addButton"
          style={{marginBottom:'15px'}}
          onClick={this.toggleViews.bind(this)}
        >
          Add New User
        </Button>
        {users.length ? (
          <ChatList
            className={!this.props.showSignInList ? "chat-list" : "user-list"}
            dataSource={users.map((f, i) => {
              let date = null;
              // if (
              //   !this.props.showSignInList &&
              //   f.messages &&
              //   f.messages.length
              // ) {
              //   let lastMessage = f.messages[f.messages.length - 1];
              //   date = new Date(lastMessage.timeStamp);
              //   subtitle =
              //     (lastMessage.position === "right" ? "You: " : f.name + ": ") +
              //     lastMessage.text;
              // }
              return {
                avatar:
                  "https://houstontamilchair.org/wp-content/uploads/2020/07/parent-directory-avatar-2png-avatar-png-256_256.png",
                alt: f.first_name[0],
                title: f.first_name + " " + f.last_name,
                date: date,
                // unread: f.unread,
                user: f,
              };
            })}
            onClick={
              !this.props.showSignInList
                ? this.props.onChatClicked
                : this.props.onUserClicked
            }
          />
        ) : (
          <div className="text-center no-users">No users to show.</div>
        )}
      </div>
    );
  }
}
