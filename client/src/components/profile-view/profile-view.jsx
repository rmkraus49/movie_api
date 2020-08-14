import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Container, Tabs, Tab, Card, Nav } from 'react-bootstrap';
import axios from 'axios';

export class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {
      userDetail: null,
      username: localStorage.user,
      password: null,
      email: null,
      birthday: null,
    }
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  getUserDetail(username) {
    axios.get(`https://fantastic-films.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${localStorage.token}` }
    })
      .then(response => {
        this.setState({
          userDetail: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
        });
        console.log(this.state.userDetail);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleDeregister() {
    console.log('deregister top');
    axios.delete(`https://fantastic-films.herokuapp.com/users/${localStorage.user}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`
      }
    })
      .then(() => {
        console.log('after delete');
        console.log('logout start');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.open('/client', '_self')
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleUpdate() {
    event.preventDefault();
    const { username, password, email, birthday } = this.state;
    axios.put(`https://fantastic-films.herokuapp.com/users/${localStorage.user}`, {
      NewUsername: username,
      NewPassword: password,
      NewEmail: email,
      NewBirthday: birthday,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`
      }
    },
    )
      .then(() => {
        localStorage.setItem('user', username);
        window.open('/client/profile', '_self');
      })
      .catch(() => {
        console.log('error updating user');
      });
  };

  render() {
    const { userDetail, username, password, email, birthday } = this.state;
    if (!this.state.userDetail) {
      this.getUserDetail(username);
      console.log(userDetail);
      return (
        <div className="profile-view"></div>
      );
    };

    return (
      <Container>
        <Tabs defaultActiveKey="profile">
          <Tab eventKey="profile" title="View Profile">
            <Form>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control readOnly type="text" placeholder={`${userDetail.Username}`} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control readOnly placeholder="********" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control readOnly placeholder={`${userDetail.Email}`} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Birthday</Form.Label>
                <Form.Control readOnly placeholder={`${userDetail.Birthday}`} />
              </Form.Group>
              <Button variant="primary" onClick={this.handleDeregister}>
                Delete account
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="update" title="Update Profile">
            <Form>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>New username</Form.Label>
                <Form.Control type="text" placeholder={"Username"} value={username} onChange={e => this.setState({ username: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>New password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => this.setState({ password: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>New email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => this.setState({ email: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="birthday">
                <Form.Label>New birthday</Form.Label>
                <Form.Control type="date" placeholder="Birthday" value={birthday} onChange={e => this.setState({ birthday: e.target.value })} />
              </Form.Group>
              <Form.Text className="text-muted">
                We'll never share your information with anyone else.
        </Form.Text>
              <Button variant="primary" type="submit" onClick={this.handleUpdate}>
                Submit
      </Button>
            </Form>
          </Tab>
        </Tabs>
      </Container >
    );
  }
}

ProfileView.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  email: PropTypes.string,
}