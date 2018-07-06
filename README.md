# Express Reset Password

For the express server to reset user password by aws ses and redis cache,
typescript base.

## Installation

```
yarn add express-reset-password
```

## Uses

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const {
  resetPassword,
  resetPasswordToken
} = require('express-reset-password').default;
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
```

## Environment

- REDIS_HOST - default (redis://localhost:6379)

- AWS_SES_REGION - default (us-west-2)

- EMAIL_RESETPASSWORD_HOST default (http://localhost:8080/reset-password)

- EMAIL_RESETPASSWORD_SENDER (required)

- EMAIL_RESETPASSWORD_EXPIREDTIME default (300sec)

## Reset callback data

From `next()` callback, the reset payload will merge into req.body object.

### Successed

```javascript
// req.body
{
  token: 'c1a6b06ec9ebf5b43039b0322748f422a8dce40bbd26c629f6bd294ce3fd4aa8',
  success: true,
  resetPayload: {
    email: 'sal95610@gmail.com',
    token: 'c1a6b06ec9ebf5b43039b0322748f422a8dce40bbd26c629f6bd294ce3fd4aa8'
  }
};
```

### Failed

```javascript
// req.body
{
  token: 'notreall',
  success: false,
  resetPayload: {}
};
```

## Q&A

- resetPassword middleware request body ?

You should use express middleware `body-parser` to parse your request into `req.body`, and your server just receive the `email` only.

```javascript
(req, res) => {
  const { email } = req.body;
};
```

Error Handle: If your undefined or null, you can receive the `The email shouldn't be empty.` response.

- resetPasswordToken middleware request body ?

You should use express middleware `body-parser` to parse your request into `req.body`, and your server just receive the `email` only.

```javascript
(req, res) => {
  const { token } = req.body;
};
```

- how to set AWS credentials ?

See the aws credentials setting document.

always in `~/.aws/credentials`

```
[default]
aws_access_key_id = your_key_id
aws_secret_access_key = your_access_key
```

- how to connection redis ?

When you use local or test env, you can just use default host `redis:localhost:6379`, or you can set your own redis host enviroment.

- how to set my express router ?

The `express-reset-password` like the middleware, so you can set your own express router.

# License

MIT
