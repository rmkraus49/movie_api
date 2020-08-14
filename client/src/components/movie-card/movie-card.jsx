import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col } from 'react-bootstrap';
import Link from 'react-router-dom';
import '../movie-card/movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <Col xs={6} md={4} xl={3}>
        <Card style={{ width: '16rem' }} className="movie-card">
          <a href={`/client/movies/${movie._id}`}>
            <Card.Img variant="top" src={movie.ImagePath} href={`/client/movies/${movie._id}`} />
          </a>
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
            <Card.Link href={`/client/movies/${movie._id}`}>Details</Card.Link>
          </Card.Body>
        </Card>
      </Col >
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired
};