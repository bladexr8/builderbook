// Handle User Authentication with Google
import passport from 'passport';
import { OAuth2Strategy as Strategy } from 'passport-google-oauth';

import User from './models/User';

function auth({ ROOT_URL, server }) {

    // function to be used by Passport Strategy
    // receives profile and tokens from Google's response.
    // Passport requires a verified() callback 
    // (function that is an argument of another function) 
    const verify = async (accessToken, refreshToken, profile, verified) => {

        //console.log("[INFO] Received Google Access Token: ", accessToken);
        //console.log("[INFO] Received Google Refresh Token: ", refreshToken);
        //console.log("[INFO] Received Google Profile: ", profile);

        let email;
        let avatarUrl;

        if (profile.emails) {
            email = profile.emails[0].value;
        }

        //console.log("[INFO] Email: ", email);

        if (profile.photos && profile.photos.length > 0) {
            avatarUrl = profile.photos[0].value.replace('sz=50', 'sz=128');
        }

        //console.log("[INFO] Avatar: ", avatarUrl);

        // if user exists, they will be signed in, if not, created
        try {
            const user = await User.signInOrSignUp({
                googleId: profile.id,
                email,
                googleToken: { accessToken, refreshToken },
                displayName: profile.displayName,
                avatarUrl,
            });
            verified(null, user);
        } catch (err) {
            verified(err);
            console.log("[INFO] Error Logging In User: ",err); // eslint-disable-line
        }
    };

    passport.use(new Strategy({
            clientID: process.env.Google_clientID,
            clientSecret: process.env.Google_clientSecret,
            callbackURL: `${ROOT_URL}/oauth2callback`
        },
        verify,
    ));

    // Serialize and deserialize user
    // initial passport and save session to keep
    // user logged in (via browser cookie)

    // To support persistent sessions, Passport associates a session with
    // a user by saving user.id to the session using passport.serializeUser() method
    // Persistent sessions are enabled by a browser cookie which matches a unique
    // session in the Mongo DB database
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    // if cookie from browser matches session, and session contains a user id,
    // then take the user id and find the user in the database with User.findById().
    // Note only public fields are sent to the client
    // passport.deserializeUser() is used by Passport to pass user object to req.user
    passport.deserializeUser((id, done) => {
        User.findById(id, User.publicFields(), (err, user) => {
            done(err, user);
        });
    });

    // initialise passport middleware
    server.use(passport.initialize());
    server.use(passport.session());


    // Express routes

    // Authentication Route
    // specify profile and email scopes as this is only data we require
    // select_account allows user to choose from multiple accounts (if applicable)
    // on every login
    server.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
    }));

    // Callback URL after Google Authentication
    // Note Passport requires authentication again on
    // callback route
    // if auth fails, redirect user back to login page,
    // otherwise redirect to Index page
    server.get('/oauth2callback', passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        res.redirect('/');
    });

    // log out user
    server.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    });
}

export default auth;
