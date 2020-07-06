import React from 'react';
import { Card, Button, Container, Col, Row } from 'react-bootstrap';
import '../movie-view/movie-view.scss';

// eslint-disable-next-line import/prefer-default-export
export class MovieView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { movie, onClick } = this.props;

    if (!movie) return null;
    console.log(movie);


    return (
      <Container className="movie-detail">
        <Row>
          <Col xs={12} sm={4}>
            <Card>
              <Card.Img src={movie.ImagePath} />
            </Card>
          </Col>
          <Col xs={12} sm={8}>
            <Card style={{ width: '16 rem' }}>
              <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>
                  Director: <Card.Link href={`/directors/${movie.Director.Name}`}>        {movie.Director.Name}</Card.Link>
                </Card.Text>
                <Card.Text>
                  Genre: <Card.Link href={`/genres/${movie.Genre.Name}`}>{movie.Genre.Name}</Card.Link>
                </Card.Text>
                <Card.Text>{movie.Description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button href={`/`} className="close-button" variant="secondary">Close</Button>
              </Card.Footer>
            </Card >
          </Col>
        </Row>
      </Container>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Director: PropTypes.string.isRequired,
    Genre: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func,
}