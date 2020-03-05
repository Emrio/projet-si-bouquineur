import passport from 'passport'
import { User } from '../models/User'

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user: any, done) => {
  if (!user || !user._id) done(new Error('User should exist'))
  User.findById(user._id)
    .then(user => done(null, user))
    .catch(err => done(err, false))
})
