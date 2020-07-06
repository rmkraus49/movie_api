import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://fantastic-films.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        axios.post('https://fantastic-films.herokuapp.com/login', null, {
          params: {
            Username: username,
            Password: password,
          }
        })
          .then(response => {
            const data = response.data;
            console.log(data);
            props.onLoggedIn(data);
            window.open('/', '_self');
          })
          .catch(e => {
            console.log('error logging in');
          })
      })
      .catch(e => {
        console.log('error registering user');
      });
  };

  return (
    <Container>
      <Form>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="birthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="date" placeholder="Birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
        </Form.Group>
        <Form.Text className="text-muted">
          We'll never share your information with anyone else.
        </Form.Text>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
      </Button>
      </Form>
    </Container>
  );
}

RegistrationView.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  email: PropTypes.string,
}