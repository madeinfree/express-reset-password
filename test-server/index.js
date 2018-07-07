const express = require('express');
const bodyParser = require('body-parser');
const {
  resetPassword,
  resetPasswordToken,
  inject
} = require('../build').default;

const app = express();

// custom email template example
inject.emailTemplate = (token, host) => `
Hi, <br />
This is a custom email template <br />
you can reset your email from link <br />
${host}?token=${token} <br />
Don't share this email for any one. <br />
`;

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
