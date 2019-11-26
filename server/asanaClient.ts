import asana, { Dispatcher } from 'asana';
import User from './entities/User';
import redisClient from './redis';
import fetch from 'isomorphic-unfetch';
import refresh from 'passport-oauth2-refresh';

export default async function createAsanaClient(user: User): Promise<asana.Client> {
  let token = await redisClient.get(`${user.id}-accessToken`);
  if (!token) {
    // Refresh the access token
    const accessToken = await new Promise<string>((resolve, reject) => {
      refresh.requestNewAccessToken('Asana', user.refreshToken, (err, accessToken) => {
        if (err) return reject(err);
        return resolve(accessToken);
      });
    });
    // Update the user's access token
    token = accessToken;
    const key = `${user.id}-accessToken`;
    await redisClient.set(key, accessToken);
    await redisClient.expire(key, 60 * 60);
  }
  const client = asana.Client.create({ 
    clientId: process.env.ASANA_CLIENT_ID, 
    clientSecret: process.env.ASANA_CLIENT_SECRET,
    defaultHeaders: {
      'Asana-Enable': 'string_ids'
    }
  }).useOauth({ 
    credentials: { 
      access_token: token, 
      refresh_token: user.refreshToken 
    } 
  });
  return client;
}
