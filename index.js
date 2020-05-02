const express = require('express'),
  morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// let __dirname = path.resolve();

let topMovies = [
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont'
  },
  {
    title: 'Dr. Strangelove',
    director: 'Stanley Kubrick'
  },
  {
    title: '12 Angry Men',
    director: 'Sidney Lumet'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson'
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese'
  },
  {
    title: 'Spirited Away',
    director: 'Hayao Miyazaki'
  },
  {
    title: 'The Silence of the Lambs',
    director: 'Jonathan Demme'
  },
  {
    title: 'The Usual Suspects',
    director: 'Bryan Singler'
  },
  {
    title: 'Apocalypse Now',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'Reservoir Dogs',
    director: 'Quentin Tarantino'
  }
]

// get pages - index and documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/index', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

// movies routing
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) => {
    return movie.title === req.params.title
  }));
});

app.post('/movies/:title', (req, res) => {
  res.send('post a new movie');
});

app.put('/movies/:title', (req, res) => {
  res.send('update an existing movie by title');
});

app.delete('/movies/:title', (req, res) => {
  res.send('delete ' + req.params.title);
});

// genres routing
app.get('/genres/:name', (req, res) => {
  res.send('get a detailed description of the ' + req.params.name + ' genre');
});

// directors routing
app.get('/directors/:name', (req, res) => {
  res.send('get details about the director ' + req.params.name);
});

// users routing
app.get('/users/:name', (req, res) => {
  res.send('get details about the user ' + req.params.name);
});

app.post('/users/:name', (req, res) => {
  res.send('post a new user named ' + req.params.name);
});

app.put('/users/:name', (req, res) => {
  res.send('update an existing user named ' + req.params.name);
});

app.put('/users/:name/:title', (req, res) => {
  res.send('add a movie titled ' + req.params.title + ' to ' + req.params.name + '\'s list of favorites');
});

app.delete('/users/:name', (req, res) => {
  res.send('delete ' + req.params.name + '\'s user information');
});

app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});
