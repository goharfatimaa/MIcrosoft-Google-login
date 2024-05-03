const express = require('express');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const expressSession = require('express-session');

const app = express();

app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: false }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new OIDCStrategy({
    identityMetadata: 'https://login.microsoftonline.com/f8cdef3----------------91255a/v2.0/.well-known/openid-configuration',
    clientID: 'd1200000000000000000af57877fcd',
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: 'http://localhost:5000/auth/microsoft/redirect.',
    allowHttpForRedirectUrl: true,
    clientSecret: 'c28000000000000000000000000000c-6f673f5d354c',
    validateIssuer: false,
    passReqToCallback: true,
}, (req, iss, sub, profile, accessToken, refreshToken, done) => {
    return done(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    });

app.post('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    });

app.get('/', (req, res) => {
    res.send(req.isAuthenticated() ? 'Logged in' : 'Not logged in');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
