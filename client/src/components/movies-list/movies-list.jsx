import React from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import '../movies-list/movies-list.scss';
import { MovieCard } from '../movie-card/movie-card';

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.Title.includes(visibilityFilter));
  }

  if (!movies) return <div className="main-view" />;

  return <section className="movies-list-container">
    <VisibilityFilterInput visibilityFilter={visibilityFilter} />
    <div className="movies-list">
      <Row>
        {filteredMovies.map(m => <MovieCard key={m._id} movie={m} />)}
      </Row>
    </div>
  </section>;
}

export default connect(mapStateToProps)(MoviesList);

MoviesList.propTypes = {
  movies: PropTypes.array,
  visibilityFilter: PropTypes.string,
}