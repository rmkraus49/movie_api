import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Row, Container, Navbar, Nav } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import '../main-view/main-view.scss';

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      loginView: null,
      registerView: null,
    };
  }

  componentDidMount() {
    axios.get('https://fantastic-films.herokuapp.com/movies')
      .then((response) => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
  }

  onLogInClick() {
    this.setState({
      loginView: true,
    });
  }

  getMovies(token) {
    axios.get('https://fantastic-films.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(errro);
      });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
      loginView: null,
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onRegisterClick() {
    this.setState({
      registerView: true,
    });
  }

  onRegister(user) {
    this.setState({
      registerView: null,
    });
  }

  onCancelRegister() {
    this.setState({
      registerView: null,
    });
  }

  onCancelLogin() {
    this.setState({
      loginView: null,
    });
  }

  onCloseClick() {
    this.setState({
      selectedMovie: null,
    });
  }

  render() {
    const { movies, user, selectedMovie, loginView, registerView } = this.state;
    if (loginView) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} onCancelLogin={() => this.onCancelLogin()} />;

    if (registerView) return <RegistrationView onRegister={user => this.onRegister(user)} onCancelRegister={() => this.onCancelRegister()} />

    // runs before the movies have been loaded
    if (!movies) return (
      <div className="loading-view">
        Fantastic Films await...
      </div>
    );

    if (selectedMovie) return (
      <div className="main-view">
        <MovieView movie={selectedMovie} onClick={() => this.onCloseClick()} />
      </div>
    );

    return (
      <section>
        <Navbar expand="lg" className="navbar basic-nav">
          <Navbar.Brand href="#home">Fantastic Films</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link onClick={() => this.onRegisterClick()}>
                Register
              </Nav.Link>
              <Nav.Link onClick={() => this.onLogInClick()}>
                Log in
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="main-view">
          <Container>
            <Row>
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
              ))}
            </Row>
          </Container>
        </div>
      </section>
    );
  }
}

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