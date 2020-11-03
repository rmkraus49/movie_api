const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const { check, validationResult } = require('express-validator');
const Models = require('./models.js');

require('./passport');
require('dotenv').config();

/**
 * @module Endpoints
 */

const app = express();
const auth = require('./auth.js')(app);

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('connected to mongo DB'))
  .catch((err) => console.error('could not connect to mongo db', err));

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use('/client', express.static(path.join(__dirname, 'client', 'dist')));
app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// CORS
const allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', '*'];
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

// Data types
/**
 * @typedef {object} Movie
 * The Movie document, containing Director and Genre data
 * @property {string} MovieID - The movie's unique ID
 * @property {string} Title - The title of the film
 * @property {string} Description - A description of the film
 * @property {string} ImagePath - The image URL
 * @property {object} Director - The film's director, including key information about the director
 * @property {object} Genre - The name and description of the genre
 */

/**
 * @typedef {object} Director
 * Contained within the Movie document
 * @property {string} Name - The director's name
 * @property {string} Bio - A brief biography of the director
 */

/**
 * @typedef {object} Genre
 * Contained within the Movie document
 * @property {string} Name - The name of the genre
 * @property {string} Description - A brief description of the genre
 */

/**
 * @typedef {object} User
 * The User document, containing key user data
 * @property {string} Username - The user's chosen username
 * @property {string} Password - The user's hashed password
 * @property {string} Email - The user's email address
 * @property {date} Birthday - The user's birthday
 * @property {array} FavoriteMovies - An array of MovieID's indicating the user's
 *  favorites
 */

// MOVIES ROUTING

/**
 * @method GET - GET all movies
 * @returns {Movies} - Returns the Movies collection, composed of {@link Movie}
 *  objects, in JSON format
 * @property {string} URL - /movies
 * @property {n/a} Parameter - None
 * @property {n/a} Body - None
 * @property {object} Response - Returns an array of {@link Movie} objects in JSON format
 */
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

/**
 * @method GET - GET a movie by title
 * @returns {Movie} - Returns a single {@link Movie} object in JSON format,
 *  where the title matches the query parameter
 * @property {string} URL - /movies/:Title
 * @property {string} Parameter - Title
 * @property {n/a} Body - None
 * @property {object} Response - Returns a {@link Movie} object in JSON format
 */
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

/**
 * @method GET - GET a genre by title
 * @returns {Genre} - Returns a single {@link Genre} object in JSON format,
 *  where the title matches the query parameter
 * @property {string} URL - /movies/Genre/:Title
 * @property {string} Parameter - Title
 * @property {n/a} Body - None
 * @property {object} Response - Returns a {@link Genre} object in JSON format
 */
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

/**
 * @method GET - GET a director by name
 * @returns {Director} - Returns a single {@link Director} object in JSON format,
 *  where the name matches the query parameter
 * @property {string} URL - /Directors/:Name
 * @property {string} Parameter - Name
 * @property {n/a} Body - None
 * @property {object} Response - Returns a {@link Director} object in JSON format
 */
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

/**
 * @method GET - GET all movies by a given director
 * @returns {Movies} - Returns an array of {@link Movie} objects in JSON format,
 *  where the director name matches the query parameter
 * @property {string} URL - /movies/Director/:Name
 * @property {string} Parameter - Name
 * @property {n/a} Body - None
 * @property {object} Response - Returns an array of {@link Movie} objects in JSON format
 */
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
/**
 * @method GET - GET all users
 * @returns {Users} - Returns an array of {@link User} objects in JSON format
 * @property {string} URL - /users
 * @property {n/a} Parameter - None
 * @property {n/a} Body - None
 * @property {object} Response - Returns an array of {@link User} objects in JSON format
 */
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

/**
 * @method GET - GET a user by Username
 * @returns {Movies} - Returns a single {@link User} object in JSON format,
 *  where the Username matches the query parameter
 * @property {string} URL - /users/:Username
 * @property {string} Parameter - Username
 * @property {n/a} Body - None
 * @property {object} Response - Returns a {@link User} object in JSON format
 */
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

/**
 * @method POST - POST a new User
 * @returns {Movies} - Returns the newly added {@link User} object in JSON format
 * @property {string} URL - /users
 * @property {n/a} Parameter - None
 * @property {object} Body - Requires the body parameters listed, in JSON format
 * @property {object} Response - Returns the newly added {@link User} object in JSON format
 * @param {string} Username - The new username
 * @param {string} Password - The hashed password
 * @param {string} Email - The user's email address
 * @param {date} Birthday - The user's birthday
 */
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

/**
 * @method PUT - PUT to update an existing User
 * @returns {User} - Returns the newly updated {@link User} object in JSON format
 * @property {string} URL - /users/:Username
 * @property {string} Parameter - Username
 * @property {object} Body - Requires the body parameters listed, in JSON format
 * @property {object} Response - Returns the newly updated {@link User} object in JSON format
 * @param {string} Username - The new username
 * @param {string} Password - The new hashed password
 * @param {string} Email - The user's updated email address
 * @param {date} Birthday - The user's updated birthday value
 */
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
    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.NewUsername,
        Password: hashedPassword,
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

/**
 * @method PUT - Add to an existing user's list of favorite movies
 * @returns {User} - Returns the newly updated {@link User} object in JSON format
 * @property {string} URL - /users/:Username/movies/:MovieID
 * @property {string} Parameter - Username
 * @property {string} Parameter - MovieID
 * @property {n/a} Body - None
 * @property {object} Response - Returns the newly updated {@link User} object in JSON format
 */
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

/**
 * @method DELETE - Remove from an existing user's list of favorite movies
 * @returns {User} - Returns the newly updated {@link User} object in JSON format
 * @property {string} URL - /users/:Username/movies/:MovieID
 * @property {string} Parameter - Username
 * @property {string} Parameter - MovieID
 * @property {n/a} Body - None
 * @property {object} Response - Returns the newly updated {@link User} object in JSON format
 */
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

/**
 * @method DELETE - Remove an existing user
 * @returns {User} - Returns a string message confirming that the user has been deleted
 * @property {string} URL - /users/:Username
 * @property {string} Parameter - Username
 * @property {n/a} Body - None
 * @property {string} Response - Returns a string message confirming that the user has been deleted
 */
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
