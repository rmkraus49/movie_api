import React from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import '../director-view/director-view.scss';

// eslint-disable-next-line import/prefer-default-export
export class GenreView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { genre } = this.props;

    if (!genre) return null;
    console.log(genre);

    return (
      <Container className="genre-detail">
        <Card style={{ width: '16 rem' }}>
          <Card.Body>
            <Card.Title>{genre.Name}</Card.Title>
            <Card.Text>{genre.Description}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button href={`/`} className="close-button" variant="secondary">Close</Button>
          </Card.Footer>
        </Card >
      </Container>
    );
  }
}

GenreView.propTypes = {
  Name: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
}