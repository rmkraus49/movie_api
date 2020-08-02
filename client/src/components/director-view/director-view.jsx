import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Container, } from 'react-bootstrap';
import '../director-view/director-view.scss';

// eslint-disable-next-line import/prefer-default-export
export class DirectorView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { director } = this.props;

    if (!director) return null;
    console.log(director);

    return (
      <Container className="director-detail">
        <Card style={{ width: '16 rem' }}>
          <Card.Body>
            <Card.Title>{director.Name}</Card.Title>
            <Card.Text>{director.Bio}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button href={`/`} className="close-button" variant="secondary">Close</Button>
          </Card.Footer>
        </Card >
      </Container>
    );
  }
}

DirectorView.propTypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
  })
}