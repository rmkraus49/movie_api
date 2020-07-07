import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Container, Navbar, Nav, Card, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import MoviesList from '../movies-list/movies-list';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { DirectorView } from '../director-view/director-view'
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import '../main-view/main-view.scss';

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios.get('https://fantastic-films.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
    window.open('/client/profile', '_self');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ user: null });
  }

  render() {

    let { movies } = this.props;
    let { user } = this.state;

    // if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    if (!movies) return <div className="main-view" />;

    return (
      <Router basename="/client">
        <Navbar expand="lg" className="navbar basic-nav">
          <Navbar.Brand as={Link} to="/" >
            Fantastic Films
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Log in
              </Nav.Link>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="main-view">
          <Route exact path="/" render={() => {
            if (!user) return (
              <Container className="main-view">
                <Card style={{ width: '16 rem' }}>
                  <Card.Body>
                    <Card.Title>Welcome!</Card.Title>
                    <Card.Text>Please log in or register to continue.</Card.Text>
                    <Button href={`/login`} variant="primary" className="welcome-button">Log in</Button>
                    <Button href={`/register`} variant="primary" className="welcome-button">Register</Button>
                  </Card.Body>
                </Card >
              </Container>
            );
            return <MoviesList movies={movies} />;
          }
          } />

          <Route path="/register" render={() => <RegistrationView onLoggedIn={user => this.onLoggedIn(user)} />} />

          <Route path="/login" render={() => <LoginView onLoggedIn={user => this.onLoggedIn(user)} />} />

          <Route path="/profile" render={() => {
            if (!user) return (
              <Container className="main-view">
                <Card style={{ width: '16 rem' }}>
                  <Card.Body>
                    <Card.Title>Welcome!</Card.Title>
                    <Card.Text>Please log in or register to continue.</Card.Text>
                    <Button href={`/login`} variant="primary" className="welcome-button">Log in</Button>
                    <Button href={`/register`} variant="primary" className="welcome-button">Register</Button>
                  </Card.Body>
                </Card >
              </Container>
            );
            return (
              <ProfileView getUserDetail={user => this.getUserDetail(user)} logout={() => this.logout()} />
            );
          }
          } />

          <Route exact path="/movies/:movieId" render={({ match }) => {
            return (
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} className="movie-view" />
            )
          }
          } />

          <Route exact path="/directors/:name" render={({ match }) => {
            console.log(movies);
            const dirMovie = movies.find(m => m.Director.Name === match.params.name);
            console.log(dirMovie);
            if (!dirMovie) return (
              <div className="main-view"></div>
            )
            return (
              <DirectorView director={dirMovie.Director} />
            );
          }
          }
          />
          <Route exact path="/genres/:name" render={({ match }) => {
            console.log(movies);
            const genMovie = movies.find(m => m.Genre.Name === match.params.name);
            console.log(genMovie);
            if (!genMovie) return (
              <div className="main-view"></div>
            )
            return (
              <GenreView genre={genMovie.Genre} />
            );
          }
          }
          />

        </div>
      </Router >
    );
  }
}

let mapStateToProps = state => {
  return { movies: state.movies }
}

export default connect(mapStateToProps, { setMovies })(MainView);

MainView.propTypes = {
  movies: PropTypes.array,
  selectedMovie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    Username: PropTypes.String,
    Password: PropTypes.string,
  }),
  loginView: PropTypes.bool,
  registerView: PropTypes.bool,
};