const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const initMongoose = require('./config/mongooseConfig');
const middlewares = require('./services/middlewares');
const router = require('./router');

const PORT = process.env.PORT || 5000;

dotenv.config({ path: 'src/config.env' });
const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, './public')));
//CORS
app.use((req, res, next) => {
  process.env.NODE_ENV === 'production'
    ? res.setHeader(
        'Access-Control-Allow-Origin',
        'https://martynosa-project-tracker.netlify.app'
      )
    : res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');
  next();
});
app.use(cookieParser());
app.use(middlewares.auth);
app.use(router);

initMongoose()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`env = ${process.env.NODE_ENV} and listening on ${PORT}...`)
    )
  )
  .catch((error) => console.log('mongoose failed:' + error));
