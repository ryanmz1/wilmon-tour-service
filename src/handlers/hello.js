async function hello(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from wilmon tour' }),
  };
}

export const handler = hello;
