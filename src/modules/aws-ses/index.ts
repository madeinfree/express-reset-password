import * as AWS from 'aws-sdk';

const createSESClient = (options: AWS.SES.ClientConfiguration) =>
  new AWS.SES(options);

export default {
  createSESClient
};
