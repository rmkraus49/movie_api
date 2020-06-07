const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const Models = require('./models.js');

require('./passport');

const app = express();
const auth = require('./auth.js')(app);

const Movies = Models.Movie;
const Users = Models.User;


mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected to mongo DB')).catch((err) => console.error('could not connect to mongo db', err));

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// CORS
const allowedOrigins = ['http://localhost:8080'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = `The CORS policy for this application does not allow access from origin ${origin}`;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
}));


// get pages - index and documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/index', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

// MOVIES ROUTING
// get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/Genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/Directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/Director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users',
  [
    check('Username', 'Username is required and must be at least five characters in length.').isLength({ min: 5 }),
    check('Username', 'Username contains non-alphanumeric characters.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(`${req.body.Username} already exists`);
        }
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
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
app.put('/users/:Username',
  [
    check('NewUsername', 'Username must be alphanumeric.').isAlphanumeric(),
    check('NewUsername', 'Username is required and must be at least five characters in length.').isLength({ min: 5 }),
    check('NewEmail', 'Not a valid email address.').isEmail(),
  ],
  passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
        {
          Username: req.body.NewUsername,
          Password: req.body.NewPassword,
          Email: req.body.NewEmail,
          Birthday: req.body.NewBirthday,
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`App is listening on port ${port}.`);
});
