import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import httpErrors from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createTravel(event, context) {
  // const { userId } = event.queryStringParameters;
  // const { userId } = event.authorizer;
  const userId = '001';
  const now = new Date();
  const travel = {
    id: uuid(),
    userId: userId,
    location: {
      id: '002',
      description: 'Lake Union Park',
      geometry: {
        latitude: '47.627149081040365',
        longitude: '-122.3371843684437',
      },
    },
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.WILMON_TRAVELS_TABLE,
        Item: travel,
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new httpErrors.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(travel, event, context),
  };
}

export const handler = createTravel;
