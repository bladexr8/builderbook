// Create and start an Express Server
// integrated with Next

import express from 'express';
import next from 'next';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import session from 'express-session';
import mongoSessionStore from 'connect-mongo';
import User from './models/User';

// load env variables from .env file
dotenv.config();

const port = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL_TEST;

// console.log('[INFO] Mongo Url = ', MONGO_URL); // eslint-disable-line no-console

mongoose.connect(MONGO_URL);

const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // set up Mongo DB Sessions
  const MongoStore = mongoSessionStore(session);

  const sess = {
    name: 'builderbook.sid',
    secret: 'HD2w.)q*VqRT4/#NK2M/,E^B)}FED5fWU!dKe[wk',
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60,   // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  };

  server.use(session(sess));

  // map Express Route to Next Route
  // render pages/index.js on server
  // and send to client
  server.get('/', async (req, res) => {
    req.session.foo = 'bar';
    // const user = { email: 'team@builderbook.org' };
    const user = await User.findOne({ slug: 'team-builder-book' });
    app.render(req, res, '/', { user });
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`[INFO] Ready on port ${ROOT_URL}...`); // eslint-disable-line no-console
  });
});
