import dotenv from 'dotenv';

import express from 'express';
import next from 'next';

import mongoose from 'mongoose';

import session from 'express-session';
import mongoSessionStore from 'connect-mongo';

// import User from './models/User';
import auth from './google';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL);

const port = process.env.PORT || 8000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  // confuring MongoDB session store
  const MongoStore = mongoSessionStore(session);

  const sess = {
    name: 'builderbook.sid',
    secret: 'HD2w.)q*VqRT4/#NK2M/,E^B)}FED5fWU!dKe[wk',
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  };

  server.use(session(sess));

  // Add Support for Google Authentication (using Passport)
  auth({ server, ROOT_URL });

  // this is testing code, remove later
  /*server.get('/', async (req, res) => {
    User.findOne({ slug: 'team-builder-book' }).then(user => {
      req.user = user;
      app.render(req, res, '/');
    })
  });*/

  // any routes not declared before here will be managed by Next
  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
});
