import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink as RouterNavLink } from 'react-router-dom';
import {
  Button,
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Jumbotron
} from 'reactstrap';
import { UserAgentApplication } from 'msal';
// import '@fortawesome/fontawesome-free/css/all.css';
// import 'bootstrap/dist/css/bootstrap.css';
import { config } from '../config/teamsConfig';
import ErrorMessage from '../apis/teams/ErrorMessage';
import { normalizeError, getUserProfile } from '../apis/teams/MSUtils';

class teamsLogin extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      error: null,
      isAuthenticated: false,
      user: {}
    };

    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.clientId,
        redirectUri: config.redirectUri
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
      }
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  async login() {
    try {
      await this.userAgentApplication.loginPopup(
        {
          scopes: config.scopes,
          prompt: "select_account"
        });
      const user = await getUserProfile(this.userAgentApplication, config.scopes);
      console.log(user);
      this.setState({
        isAuthenticated: true,
        user: {
          displayName: user.displayName,
          email: user.mail || user.userPrincipalName
        },
        error: null
      });
      console.log(user);
    }
    catch (err) {
      this.setState({
        isAuthenticated: false,
        user: {},
        error: normalizeError(err)
      });
    }
  }

  logout() {
    this.userAgentApplication.logout();
  }

  render() {
    let error = null;
    if (this.state.error) {
      error = <ErrorMessage
        message={this.state.error.message}
        debug={this.state.error.debug} />;
    }
    return (
      <Router>
        <div>
          <Container>
            {error}
            <Route exact path="/"
              render={() =>
                <Jumbotron>
                  {this.state.isAuthenticated
                    ? <div>
                      <h4>Welcome {this.state.user.displayName}!</h4>
                    </div>
                    : <Button color="primary" onClick={() => this.login()}>Click here to sign in</Button>
                  }
                </Jumbotron>
              } />
          </Container>
        </div>
      </Router>
    );
  }
}

export default teamsLogin;