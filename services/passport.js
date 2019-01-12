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
    }, (accessToken, refreshtoken, profile, done) =>{ // CALL BACK FUNCTION 
        console.log("profile", profile);
        User.findOne({googleId:profile.id}) // MONGO DB QUERY WHICH IS ASYNC OPERATION
            .then(existingUser =>{
                if (existingUser){
                    done(null, existingUser) // THIS IS A CALLBACK FUNCTION WHICH TELLS PASSPORT THAT USER IS OPERATION IS DONE 
                } else {
                    new User({ googleId:profile.id }).save()
                        .then(user =>done(null, user))
                }
            }) 
    }
));