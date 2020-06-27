import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Container } from 'react-bootstrap';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const registrationSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    props.onRegister(username);
  };

  const cancelRegister = (e) => {
    e.preventDefault();
    console.log("registration cancelled");
    props.onCancelRegister();
  };

  return (
    <Container>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
        </Form.Text>
        </Form.Group>
        <Form.Group controlId="birthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="date" placeholder="Birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={registrationSubmit}>
          Submit
      </Button>
        <Button variant="secondary" type="submit" onClick={cancelRegister}>
          Cancel
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