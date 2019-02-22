const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');
passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser((id, done) =>{
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.use(new GoogleStrategy(
    {
        clientID : keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, async (accessToken, refreshtoken, profile, done) =>{ // CALL BACK FUNCTION 
        console.log("profile", profile);
        const existingUser = await User.findOne({googleId:profile.id}) // MONGO DB QUERY WHICH IS ASYNC OPERATION
            if (existingUser){
                return done(null, existingUser) // THIS IS A CALLBACK FUNCTION WHICH TELLS PASSPORT THAT USER IS OPERATION IS DONE 
            } 
            const user = await new User({ googleId:profile.id }).save()
            done(null, user)

    }
));  