import * as AWS from 'aws-sdk';

const createSESClient = (options: any) => new AWS.SES(options);

export default {
  createSESClient
};
