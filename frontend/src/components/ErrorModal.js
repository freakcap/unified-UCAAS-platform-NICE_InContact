import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

/**
 *
 * Renders a Error modal if app encounter any error.
 */

export default class ErrorModal extends Component {
  state = {};
  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h1 className="text-center">
          </h1>
          <h5 className="text-center">{this.props.errorMessage}</h5>
        </Modal.Body>
      </Modal>
    );
  }
}
