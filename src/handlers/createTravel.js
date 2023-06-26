import httpErrors from 'http-errors';
import { generateTravel } from '../lib/generateTravel';

async function createTravel(event, context) {
  // const userId = event.requestContext.authorizer.claims.sub;
  const userId = event.requestContext.authorizer.sub;

  try {
    const travel = await generateTravel({ userId });
    return {
      statusCode: 201,
      body: JSON.stringify(travel),
    };
  } catch (error) {
    console.log(error);
    throw new httpErrors.InternalServerError(error);
  }
}

export const handler = createTravel;
