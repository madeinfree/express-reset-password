const express = require('express');
const bodyParser = require('body-parser');
const { resetPassword, resetPasswordToken } = require('../build/index').default;
const app = express();

const resetCallback = (req, res) => {
  const body = req.body;
  console.log(body);
};

app.use(bodyParser());
app.post('/reset', resetPassword);
app.post('/reset/token', resetPasswordToken, resetCallback);
app.get('/reset-password', (req, res) => {
  const { token } = req.query;
  res.status(200).send(token);
});

app.listen(8080, () => console.log('Server run on port 8080'));
