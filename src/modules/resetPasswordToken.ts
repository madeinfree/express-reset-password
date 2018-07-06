import { RequestHandler, Request } from 'express';
import { redisClient } from './redis';

const REQUEST_ERROR_MESSAGE: string = `
Can't find any request body, you should try 'npm install body-parser' in your middleware.
"""
const bodyParser = require('body-parser');
app.use(bodyParser());
"""
`;

const throwError = (error: string) => {
  throw new Error(error);
};

const hasRequestBody: Function = (request: Request): boolean | object => {
  return request.body;
};

const resetPasswordToken = (redisClient: redisClient): RequestHandler => (
  req,
  res,
  next
) => {
  if (!hasRequestBody(req)) {
    throwError(REQUEST_ERROR_MESSAGE);
  }
  const { token } = req.body;
  redisClient.get(`PASSWORD:RESET:${token}`, (err: any, reply) => {
    if (err) {
      throw new Error(err);
    } else {
      let parseReply = {};
      let payload = {
        success: false,
        resetPayload: {}
      };
      if (reply) {
        try {
          parseReply = JSON.parse(reply);
        } catch (err) {
          throw new Error(err);
        }
        payload = {
          success: true,
          resetPayload: {
            ...parseReply
          }
        };
      }
      req.body = {
        ...req.body,
        ...payload
      };
      next();
    }
  });
};

export default resetPasswordToken;
