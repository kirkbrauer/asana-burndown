import passport from 'passport';
import { Express } from 'express';
import { Strategy as AsanaStrategy } from 'passport-asana';
import User from './entities/User';
import { connection } from './db';

export default function configurePassport(server: Express) {
  // Configure passport asana strategy
  passport.use('Asana', new AsanaStrategy(
    {
      clientID: process.env.ASANA_CLIENT_ID,
      clientSecret: process.env.ASANA_CLIENT_SECRET,
      callbackURL: process.env.ASANA_CALLBACK_URL
    },
    (accessToken: string, refreshToken: string, { _raw }, done) => {
      const profile: { gid: string; email: string; name: string; } = JSON.parse(_raw).data;
      connection.getRepository(User).findOne({ providerId: profile.gid }).then((user) => {
        if (!user) {
          const newUser = new User();
          newUser.email = profile.email;
          newUser.name = profile.name;
          newUser.providerId = profile.gid;
          newUser.refreshToken = refreshToken;
          newUser.accessToken = accessToken;
          connection.getRepository(User).save(newUser).then((user) => {
            done(null, user);
          }).catch((error) => {
            done(error, null);
          });
        } else {
          done(null, user);
        }
      }).catch((error) => {
        done(error, null);
      });
    }
  ));
  // Configure user serialization function
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });
  // Configure user deserialization function
  passport.deserializeUser((id: any, done) => {
    connection.getRepository(User).findOne({ id }).then((user) => {
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
    res.redirect(process.env.REDIRECT_URL);
  });
  // Return passport instance
  return passport;
}
