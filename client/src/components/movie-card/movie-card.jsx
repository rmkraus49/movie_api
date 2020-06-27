import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col } from 'react-bootstrap';
import '../movie-card/movie-card.scss'

export class MovieCard extends React.Component {
  render() {
    const { movie, onClick } = this.props;

    return (
      <Col xs={6} md={4} xl={3}>
        <Card style={{ width: '16rem' }} className="movie-card">
          <Card.Img variant="top" src={movie.ImagePath} onClick={() => onClick(movie)} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button onClick={() => onClick(movie)} variant="primary">Details</Button>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired
};