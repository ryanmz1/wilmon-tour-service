import { createClient } from 'redis';

const redisCli = createClient({
  password: process.env.REDIS_PWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

function stringify(v) {
  let r = v;
  if (typeof v !== 'string') {
    r = JSON.stringify(r);
  }
  return r;
}

export async function updateCache(params) {
  let { key, field, value } = params;
  key = stringify(key);
  value = stringify(value);
  await redisCli.connect();
  if (field) {
    field = stringify(field);
    await redisCli.HSET(key, field, value);
  } else {
    await redisCli.SET(key, value);
  }
  await redisCli.quit();
}
