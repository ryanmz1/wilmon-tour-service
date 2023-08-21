import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import httpErrors from 'http-errors';
import { createClient } from 'redis';
import { updateCache } from '../lib/redisHelper';

const redisCli = createClient({
  password: process.env.REDIS_PWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

async function getPlaceIdByRandom() {
  try {
    await redisCli.connect();
    const id = await redisCli.SRANDMEMBER(process.env.PLACE_IDS_SET);
    await redisCli.quit();
    return id;
  } catch (error) {
    console.log(error);
  }
}

async function notAlreadyTraveled(placeId, userId) {
  // const key = 'userTravels:' + userId + placeId;
  const key = `user:${userId}`;
  const field = `place:${placeId}`;
  try {
    await redisCli.connect();
    const exists = await redisCli.HEXISTS(key, field);
    await redisCli.quit();
    return exists == 0;
  } catch (error) {
    console.log(error);
  }
}

async function getRandomPlace(userId) {
  let isValid, id;
  try {
    do {
      id = await getPlaceIdByRandom();
      isValid = await notAlreadyTraveled(id, userId);
    } while (!isValid);
    const result = await dynamodb
      .get({
        TableName: process.env.TRAVEL_PLACES_TABLE,
        Key: { id },
      })
      .promise();
    return result.Item;
  } catch (error) {
    console.log(error);
  }
}

// VERSION 1
// 1) generate a random number
// 2) get location ids into memory
// 3) get place from DB by the random number
// VERSION 2
// 1) get the random id from redis set
//  2.1) user travels store in Redis, maybe use 'exist' operator
// 3) if not, get the random place from db and return
export async function generateTravel(params) {
  const { userId, userEmail } = params;
  try {
    let randomPlace = await getRandomPlace(userId);
    const now = new Date();
    const { id, title, address, image, coordinates } = randomPlace;
    const travel = {
      id: uuid(),
      userId: userId,
      location: {
        placeId: id,
        title,
        address,
        imageUrl: image.imageUrl,
        coordinates,
      },
      createdAt: now.toISOString(),
    };
    await dynamodb
      .put({
        TableName: process.env.WILMON_TRAVELS_TABLE,
        Item: travel,
      })
      .promise();
    await updateCache({
      key: `user:${userId}`,
      field: `place:${travel.location.placeId}`,
      value: {
        title: travel.location.title,
        address: travel.location.address,
        imageUrl: travel.location.imageUrl,
        coordinates: travel.location.coordinates,
      },
    });
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          source: process.env.MAIL_SOURCE,
          subject: 'New Travel With Wilmon',
          recipient: userEmail,
          body: `Your wilmon travels in ${travel.location.address}, take a look now: `,
        }),
      })
      .promise();
    return travel;
  } catch (error) {
    console.log(error);
    throw new httpErrors.InternalServerError(error);
  }
}
