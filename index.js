const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected to mongo DB')).catch((err) => console.error('could not connect to mongo db', err));

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// get pages - index and documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/index', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

// MOVIES ROUTING
// get all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// get a single movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(`A film titled "${req.params.Title}" could not be found.`);
      }
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// get info about a genre by genre name
app.get('/movies/Genre/:Name', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movies) => {
      if (!movies) {
        res.status(400).send(`A genre with the name "${req.params.Name}" could not be found.`);
      } else {
        res.status(200).json(
          {
            Name: movies.Genre.Name,
            Description: movies.Genre.Description,
          },
        );
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// get info about a director by name
app.get('/Directors/:Name', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then((movies) => {
      if (!movies) {
        res.status(400).send(`A director named "${req.params.Name}" could not be found.`);
      } else {
        res.status(200).json(
          {
            Name: movies.Director.Name,
            Bio: movies.Director.Bio,
            Birth: movies.Director.Birth,
            Death: movies.Director.Death,
          },
        );
      }
    })
    .catch((err) => {
      console.error();
      res.status(500).send(`Error: ${err}`);
    });
});

// get all movies by a given director, by director name
app.get('/movies/Director/:Name', (req, res) => {
  Movies.find({ 'Director.Name': req.params.Name }, 'Title')
    .then((movies) => {
      if (!movies) {
        res.status(400).send(`No movies directed by "${req.params.Name}" could be found.`);
      } else {
        res.status(200).json(movies);
      }
    })
    .catch((err) => {
      console.error();
      res.status(500).send(`Error: ${err}`);
    });
});

// USERS ROUTING
// get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// get user info by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// add a new user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.Username} already exists`);
      }
      Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
        .then((newUser) => { res.status(201).json(newUser); })
        .catch((error) => {
          console.error(error);
          res.status(500).send(`Error: ${error}`);
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    });
});

// update user info by Username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    } else {
      res.json(updatedUser);
    }
  });
});

// add movie to a user's favorites, by username & movie ID
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      } else {
        res.json(updatedUser);
      }
    },
  );
});

// remove movie from a user's favorites, by username & movie ID
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res.status(400).send(`A user with Username "${req.params.Username}" could not be found.`);
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(`${req.params.Username} was not found.`);
      } else {
        res.status(200).send(`${req.params.Username} was deleted.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});
