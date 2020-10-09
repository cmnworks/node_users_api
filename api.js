require('rootpath')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const userMiddleware = require('middleware/user_middleware');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(userMiddleware.handleError);
app.use('/users', require('./controllers/user_controller'));

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8000;
app.listen(port, () => console.log('Api listening on port ' + port));
