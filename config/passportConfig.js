const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const AmazonStrategy = require('passport-amazon').Strategy;
const bcrypt = require('bcrypt');
var randomstring = require("randomstring");
const { PrismaClient } = require('@prisma/client');
const { __ } = require('i18n');
const prisma = new PrismaClient();
passport.use(new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'password'
    },
    async (email, password, done) => {
    try {
        const User = await prisma.user.findOne({where:{email: email}});
        if (!User) {
            return done(null, false, { message: 'Email or password is incorrect'});
        }
        console.log(bcrypt.compareSync(password, User.password));
        
        if (!bcrypt.compareSync(password, User.password)) {
            return done(null, false, { message: 'Email or password is incorrect'});
        }
        if (!User.active) {
            return done(null, false, { message: "Your acount isn't active"});
        }
        console.log(User);
        
        return done(null, User);
    } catch (error) {
        return done(error);
    }

    }
));


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.HOSTURL + "/auth/facebook/callback",
    profileFields: ['id', 'email'],
  },
  async(_accessToken, _refreshToken, profile, cb) => {
      try {
          const user = await prisma.user.findOne({where: {email: profile._json.email}});
              
          if (user) {
                return cb(null, user);
            } else {
                try{
                    let password = randomstring.generate({
                        charset: profile._json.email
                      });
                    password = await bcrypt.hash(password, 10);
                    const user = await prisma.user.create({
                        data: {
                            email: profile._json.email,
                            facebookId: Number.parseInt(profile._json.id),
                            password,
                            active: true
                        }
                    });
                    return cb(null, user);
                } catch (error) {
                    cb(error);
                }
            }
      } catch (error) {
          cb(error);
      }
      
  }
));
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.HOSTURL + "/auth/github/callback"
  },
  async(_accessToken, _refreshToken, profile, cb) => {
    if (!profile._json.email) {
        const error = {};
        error.message = 'Your email should be public !';
        error.status = '404';
        error.stack = 'You can\'t signin with github if your email is private';
        return cb(error, null);
    }
    try {
        const user = await prisma.user.findOne({where: {email: profile._json.email}});
        if (user) {
              return cb(null, user);
          } else {
              try{
                  let password = randomstring.generate({
                      charset: profile._json.email
                    });
                  password = await bcrypt.hash(password, 10);
                  const user = await prisma.user.create({
                      data: {
                          email: profile._json.email,
                          githubId: Number.parseInt(profile._json.id),
                          password,
                          active: true
                      }
                  });
                  return cb(null, user);
              } catch (error) {
                  cb(error);
              }
          }
    } catch (error) {
        cb(error);
    }
    
}
));


passport.use(new AmazonStrategy({
    clientID: process.env.AMAZON_CLIENT_ID,
    clientSecret: process.env.AMAZON_CLIENT_SECRET,
    callbackURL: process.env.HOSTURL + "/auth/amazon/callback"
  },
  async(_accessToken, _refreshToken, profile, cb) => {
    if (!profile._json.email) {
        const error = {};
        error.message = 'You do\'t have email';
        error.status = '404';
        error.stack = 'You can\'t signin with amazon if you don\'t have email';
        return cb(error, null);
    }
    try {
        const user = await prisma.user.findOne({where: {email: profile._json.email}});
        if (user) {
              return cb(null, user);
          } else {
              try{
                  let password = randomstring.generate({
                      charset: profile._json.email
                    });
                  password = await bcrypt.hash(password, 10);
                  const user = await prisma.user.create({
                      data: {
                          email: profile._json.email,
                          amazonId:profile._json.user_id,
                          password,
                          active: true
                      }
                  });
                  return cb(null, user);
              } catch (error) {
                  cb(error);
              }
          }
    } catch (error) {
        cb(error);
    }
    
}
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.HOSTURL + "/auth/twitter/callback",
    includeEmail: true
  },
  async(_accessToken, _refreshToken, profile, cb) => {
      console.log(profile);
    if (!profile._json.email) {
        const error = {};
        error.message = 'You do\'t have email';
        error.status = '404';
        error.stack = 'You can\'t signin with amazon if you don\'t have email';
        return cb(error, null);
    }
    try {
        const user = await prisma.user.findOne({where: {email: profile._json.email}});
        if (user) {
              return cb(null, user);
          } else {
              try{
                  let password = randomstring.generate({
                      charset: profile._json.email
                    });
                  password = await bcrypt.hash(password, 10);
                  const user = await prisma.user.create({
                      data: {
                          email: profile._json.email,
                          twitterId:profile._json.user_id,
                          password,
                          active: true
                      }
                  });
                  return cb(null, user);
              } catch (error) {
                  cb(error);
              }
          }
    } catch (error) {
        cb(error);
    }
    
}
));


passport.serializeUser(function(user, cb) {
    console.log('uer', user);
    
    cb(null, user.id);
});

passport.deserializeUser(async(id, cb) => {
    try {
    const user = await prisma.user.findOne({where: { id: id }});
    cb(null, user);
    } catch (err) {
    return cb(err);
    }
});


  
module.exports = passport;