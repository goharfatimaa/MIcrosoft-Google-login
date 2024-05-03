const express = require('express');
const passport = require('passport');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Set up session
app.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Set up Passport
app.use(passport.initialize());
app.use(passport.session());

// AWS Cognito configuration
const poolData = {
  UserPoolId: 'eu-west-2_Ftiuyhgfdcvbp',
  ClientId: '5o887bgfdsxdcfvgbn'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

passport.use(new GoogleStrategy({
  clientID: '22-000000000000.apps.googleusercontent.com',
  clientSecret: 'GOCSPX00000000000000grENjfYTQUSPJfGXm',
  callbackURL: 'https://submittal.auth.eu-west-2.amazoncognito.com'
}, (token, tokenSecret, profile, done) => {
  // Use the profile information to create or authenticate a user in your application
  // You may need to map Google profile attributes to Cognito attributes
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  // Serialize user information and store it in the session
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  // Deserialize user information from the session
  done(null, obj);
});

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/');
  }
);

app.get('/', (req, res) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.displayName}!`);
  } else {
    res.send('Welcome!');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
