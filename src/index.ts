import reset from './modules/reset';
import token from './modules/resetPasswordToken';

const checkEnvFirst = () => {
  const {
    REDIS_HOST,
    AWS_SES_REGION,
    EMAIL_RESETPASSWORD_HOST,
    EMAIL_RESETPASSWORD_SENDER,
    EMAIL_RESETPASSWORD_EXPIREDTIME
  } = process.env;

  if (!AWS_SES_REGION) {
    console.warn(`
[Express Email Reset Warning]
You didn't setting 'AWS_SES_REGION' in your enviroment,
the default region host is 'us-west-2'
        `);
  }
  if (!REDIS_HOST) {
    console.warn(`
[Express Email Reset Warning]
You didn't setting 'REDIS_HOST' in your enviroment,
the default redis host is 'redis://localhost:6379'
    `);
  }

  if (!EMAIL_RESETPASSWORD_HOST) {
    console.warn(`
[Express Email Reset Warning]
You didn't setting 'EMAIL_RESETPASSWORD_HOST' in your enviroment,
the default client host is 'http://localhost:8080/reset-password'
    `);
  }
  if (!EMAIL_RESETPASSWORD_EXPIREDTIME) {
    console.warn(`
[Express Email Reset Warning]
You didn't setting 'EMAIL_RESETPASSWORD_EXPIREDTIME' in your enviroment,
the default token expired is '300' sec
    `);
  }
  if (!EMAIL_RESETPASSWORD_SENDER) {
    throw new Error(`
 [Express Email Reset Error]: You should setting your SES email sender.
    `);
  }
};

checkEnvFirst();

export default { resetPassword: reset, resetPasswordToken: token };
