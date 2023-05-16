import AWS from 'aws-sdk';
import httpErrors from 'http-errors';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { hGetAllValues } from '../lib/redisHelper';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTravelsFromDB(userId) {
  const params = {
    TableName: process.env.WILMON_TRAVELS_TABLE,
    IndexName: 'userIdAndDate',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  };
  const result = await dynamodb.query(params).promise();
  return result;
}

async function getTravels(event, context) {
  // const { userId } = event.queryStringParameters;
  const userId = 'visitor001';
  let travels, count;
  try {
    travels = await hGetAllValues({ key: `user:${userId}` });
    count = travels.length;
    if (travels.length === 0) {
      console.log('---from db---');
      const res = await getTravelsFromDB(userId);
      travels = res.Items;
      count = res.Count;
    }
  } catch (error) {
    console.log(error);
    throw new httpErrors.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count, data: travels }),
  };
}

export const handler = middy(getTravels).use(cors());
