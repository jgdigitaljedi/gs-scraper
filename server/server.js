const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const chalk = require('chalk');
const winston = require('./config/logger');

const routes = require('./routes/index');

require('./models/db.model');

app.use(morgan('combined', { stream: winston.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet()); // only gonna be run on my home server in my private network, but most of my friends are devs or dev ops so can't be too careful

app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000, () => console.log(chalk.cyan('app listening on port 3000!')));
