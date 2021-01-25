import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";

/**
 *
 * Renders top navbar and shows the current signed in user.
 */

class NavBar extends Component {
  state = {};
  render() {
    console.log("NavBar", this.props.signedInUser.first_name);
    return (
        <Navbar bg="light">
          <Navbar.Brand>
            <h1>  CHAT</h1>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <h3>
              Signed in as:&nbsp;
              <span>{(this.props.signedInUser || {}).first_name}</span>
            </h3>
          </Navbar.Collapse>
        </Navbar>
    );
  }
}

export default NavBar;
