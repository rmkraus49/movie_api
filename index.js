const express = require('express'),
  morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use('/', express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

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

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
})

app.listen(8080, () => {
  console.log('App is listening on port 8080.');
});
