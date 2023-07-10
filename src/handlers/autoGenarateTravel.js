import AWS from 'aws-sdk';
import { generateTravel } from '../lib/generateTravel';

const cognitoService = new AWS.CognitoIdentityServiceProvider();

async function autoGenarateTravel(event, context) {
  const res = await cognitoService
    .listUsers({
      UserPoolId: 'ap-northeast-2_HZe4H4pAn',
      AttributesToGet: ['sub'],
    })
    .promise();
  return JSON.stringify(res.Users);
}

export const handler = autoGenarateTravel;
