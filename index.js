const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const childs = require('./routes/childs');
const trajets = require('./routes/trajets');
const zones = require('./routes/zones');
const tokens = require('./routes/tokens');
const app = express();
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//users
app.use('/api/users', users);
//child
app.use('/api/childs', childs);

app.use('/api/trajets', trajets);

app.use('/api/zones', zones);

app.use('/api/tokens', tokens);

const port = 8081;

app.listen(port, () => console.log('Server running...'));
