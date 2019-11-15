import { RequestHandler } from 'express'
import moment from 'moment'
import { getUserHistory } from '../../../models/Update'
import { getLibrary, getBorrowed, getBook } from '../../../models/Book'

export const getWelcomePage: RequestHandler = function (_req, res) {
  return res.api.buildBoard('home', 'Bouquineur :: Welcome')
}

export const getDashboard: RequestHandler = function (req, res) {
  if (!req.user) return res.api.buildError(500, 'User error')
  getUserHistory(req.user._id)
    .then(history => res.api.buildBoard('dashboard', 'Bouquineur :: Tableau de bord', { user: req.user, history, moment }))
    .catch(err => {
      console.error(err)
      res.api.buildError(500, 'Error while fetching history')
    })
}

export const browseLibrary: RequestHandler = function (_req, res) {
  getLibrary()
    .then(library => res.api.buildBoard('browse', 'Bouquineur :: Bibliothèque', { library, moment }))
    .catch(err => {
      console.error(err)
      res.api.buildError(500, 'Error while fetching history')
    })
}

}

export const myBooks: RequestHandler = function (req, res) {
  if (!req.user) return res.api.buildError(500, 'User error')
  getBorrowed(req.user._id)
    .then(borrowed => res.api.buildBoard('borrowed', 'Bouquineur :: Borrowed Books', { borrowed, moment }))
    .catch(err => {
      console.error(err)
      res.api.buildError(500, 'Error while fetching history')
    })
}
