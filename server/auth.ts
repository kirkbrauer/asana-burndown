import passport from 'passport';
import { getConnection } from 'typeorm';
import { Express, Request, Response, NextFunction } from 'express';
import { Strategy as AsanaStrategy } from 'passport-asana';
import User from './entities/User';
import refresh from 'passport-oauth2-refresh';
import redisClient from './redis';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

export default function configurePassport(server: Express) {
  // Configure passport asana strategy
  const strategy = new AsanaStrategy(
    {
      clientID: process.env.ASANA_CLIENT_ID,
      clientSecret: process.env.ASANA_CLIENT_SECRET,
      callbackURL: process.env.ASANA_CALLBACK_URL
    },
    (accessToken: string, refreshToken: string, data, done) => {
      const profile: { gid: string; email: string; name: string; } = JSON.parse(data._raw).data;
      getConnection().getRepository(User).findOne({ providerId: profile.gid }).then(async (foundUser) => {
        let user: User = foundUser;
        if (!user) {
          // Create a new user
          const newUser = new User();
          newUser.email = profile.email;
          newUser.name = profile.name;
          newUser.providerId = profile.gid;
          newUser.refreshToken = refreshToken;
          // Attempt to save the new user
          try {
            user = await getConnection().getRepository(User).save(newUser);
          } catch (error) {
            done(error, null);
          }
        } else {
          // Update the user's refresh token
          user.refreshToken = refreshToken;
          await getConnection().getRepository(User).save(user);
        }
        // Cache the user access token for one hour
        const key = `${user.id}-accessToken`;
        await redisClient.set(key, accessToken);
        await redisClient.expire(key, 60 * 60);
        // Finish the strategy
        done(null, user);
      }).catch((error) => {
        done(error, null);
      });
    }
  );

  passport.use('Asana', strategy);
  refresh.use('Asana', strategy);
  
  // Configure user serialization function
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });
  
  // Configure user deserialization function
  passport.deserializeUser((id: any, done) => {
    getConnection().getRepository(User).findOne({ id }).then((user) => {
      done(null, user);
    }).catch((error) => {
      done(error, null);
    });
  });
  
  // Configure the passport middleware
  server.use(passport.initialize());
  server.use(passport.session());
  
  // Configure authentication routes
  server.get('/auth/asana', passport.authenticate('Asana'));

  server.get('/auth/asana/callback', passport.authenticate('Asana', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
  });

  server.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
  
  // Return passport instance
  return passport;
}
