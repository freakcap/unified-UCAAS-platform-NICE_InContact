import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";

/**
 *
 * Renders top navbar and shows the current signed in user.
 */

class NavBar extends Component {
  state = {};
  render() {
    return (
      <>
      <Navbar inverse>
        <Navbar.Brand>Chat</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Text pullRight>
            Signed in as:&nbsp;
            <span className="signed-in-user">{(this.props.signedInUser || {}).name}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      </>
    );
  }
}
 
export default NavBar;
