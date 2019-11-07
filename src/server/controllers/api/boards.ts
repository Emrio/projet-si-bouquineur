import { RequestHandler } from 'express'
import moment from 'moment'
import { getUsersHistory } from '../../../models/Update'

export const getWelcomePage: RequestHandler = function (_req, res) {
  return res.api.buildBoard('home', 'Bouquineur :: Welcome')
}

export const getDashboard: RequestHandler = function (req, res) {
  if (!req.user) return res.api.buildError(500, 'User error')
  getUsersHistory(req.user._id)
    .then(history => res.api.buildBoard('dashboard', 'Bouquineur :: Dashboard', { user: req.user, history, moment }))
    .catch(err => {
      console.error(err)
      res.api.buildError(500, 'Error while fetching history')
    })
}

export const browseLibrary: RequestHandler = function (_req, res) {
  return res.api.buildBoard('browse', 'Bouquineur :: Browse Library')
}

export const myBooks: RequestHandler = function (_req, res) {
  return res.api.buildBoard('borrowed', 'Bouquineur :: Borrowed Books')
}
