import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

/**
 *
 * Renders top navbar and shows the current signed in user.
 */

class NavBar extends Component {
  state = {};
  onLogoutClick = () => {
    localStorage.clear();
    var url = process.env.REACT_APP_redirectURL + "/";
    window.location = url;
  };
  render() {
    return (
      <Navbar bg="primary">
        <Navbar.Brand>
          <h1>UCAAS Synchronized Chat</h1>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <h3>
            Signed in as:&nbsp;
            <span>{(this.props.signedInUser || {}).first_name}</span>
          </h3>
          <Button onClick={this.onLogoutClick}>Logout</Button>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
