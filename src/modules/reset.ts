import { RequestHandler, Request } from 'express';
import { redisClient } from './redis';
import { EventEmitter } from './pubSub';
import SESClient from './aws-ses';

const SESRegion = process.env.AWS_SES_REGION || 'us-west-2';
let SESCredentialOptions = {};
// Use AWS standard AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID
if (process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_ACCESS_KEY_ID) {
  SESCredentialOptions = Object.assign({}, SESCredentialOptions, {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
}
const sesClient = SESClient.createSESClient({
  apiVersion: '2010-12-01',
  region: SESRegion,
  ...SESCredentialOptions
});

const REQUEST_ERROR_MESSAGE: string = `
Can't find any request body, you should try 'npm install body-parser' in your middleware.
"""
const bodyParser = require('body-parser');
app.use(bodyParser());
"""
`;

const SIMPLE_EMAIL_TEMPLATE = (token: string, host: string): string => `
Hello, <br />
This is your password reset url, please click to open it. <br />
<a href='${host}?token=${token}'>${host}/?token=${token}</a> <br />
* Don't send this mail for other people.
`;

const create_email_params = (
  email: string,
  email_sender: string | undefined,
  template: string
) => ({
  Destination: {
    ToAddresses: [email]
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: template
      }
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Password Reset'
    }
  },
  Source: email_sender
});

const sendEmailFromSES = (params: any): Promise<object> =>
  new Promise<object>((resolve, reject) => {
    sesClient.sendEmail(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

const createToken = (): Promise<string> =>
  new Promise((resolve, reject) => {
    require('crypto').randomBytes(32, function(err: string, buffer: Buffer) {
      var token = buffer.toString('hex');
      resolve(token);
    });
  });

const throwError = (error: string) => {
  throw new Error(error);
};

const hasRequestBody: Function = (request: Request): boolean | object => {
  return request.body;
};

const reset = (
  redisClient: redisClient,
  redisPubSub: EventEmitter
): RequestHandler => async (req, res) => {
  if (!hasRequestBody(req)) {
    throwError(REQUEST_ERROR_MESSAGE);
  }
  const { email } = req.body;
  if (!email) {
    res.status(200).send({
      success: false,
      error: `The email shouldn't be empty.`
    });
  }
  const flash_token = await createToken();
  const host =
    process.env.EMAIL_RESETPASSWORD_HOST ||
    `http://localhost:8080/reset-password`;
  const email_template = SIMPLE_EMAIL_TEMPLATE(flash_token, host);
  const email_sender = process.env.EMAIL_RESETPASSWORD_SENDER;
  const item = JSON.stringify({
    email: email,
    token: flash_token
  });
  const processEnvExpiredTime =
    process.env.EMAIL_RESETPASSWORD_EXPIREDTIME || '300';
  const expiredTime: number = parseInt(processEnvExpiredTime, 10);
  redisClient.set(`PASSWORD:RESET:${flash_token}`, item, 'EX', expiredTime);
  const params = create_email_params(email, email_sender, email_template);
  sendEmailFromSES(params)
    .then(data => {
      res.status(200).send({
        success: true,
        payload: data
      });
    })
    .catch((err: AWS.AWSError) => {
      res.status(err.statusCode).send({
        success: false,
        error: {
          message: err.message,
          code: err.code
        }
      });
    });
};

export default reset;
