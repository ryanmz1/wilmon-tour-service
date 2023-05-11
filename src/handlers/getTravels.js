import AWS from 'aws-sdk';
import httpErrors from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTravels(event, context) {
  // const { userId } = event.queryStringParameters;
  const userId = '001';
  let travels, count;
  const params = {
    TableName: process.env.WILMON_TRAVELS_TABLE,
    IndexName: 'userIdAndDate',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  };
  try {
    const result = await dynamodb.query(params).promise();
    travels = result.Items;
    count = result.Count;
  } catch (error) {
    console.log(error);
    throw new httpErrors.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count, data: travels }),
  };
}

export const handler = getTravels;
