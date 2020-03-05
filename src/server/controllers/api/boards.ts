import { RequestHandler } from 'express'
import moment from 'moment'
import { getUserHistory, updateBookStatus } from '../../../models/Update'
import { getLibrary, getBorrowed, getBook } from '../../../models/Book'
import { arduino } from '../../../arduino'

export const getWelcomePage: RequestHandler = function (req, res, next) {
  if (req.isAuthenticated()) {
    return getDashboard(req, res, next)
  } else {
    return res.api.buildBoard('home', 'Bouquineur :: Welcome')
  }
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

export const returnBook: RequestHandler = function (req, res) {
  const { bookId } = req.params
  if (!(bookId && typeof bookId === 'string')) return res.api.buildBoard('returnSummary', 'Id de livre incorrect', { book: { title: '' }, info: "Ce livre n'existe pas: Id de livre incorrect" })
  getBook(bookId)
    .then(async book => {
      if (!book || book.usedBy === null) return res.api.buildBoard('returnSummary', 'Livre inconnu', { book: { title: '' }, info: "Ce livre n'existe pas: Livre inconnu" })
      await updateBookStatus(book._id, req.user!._id, 'RETURN')
      return res.api.buildBoard('returnSummary', 'Livre rendu', { book, info: 'Vous pouvez remettre à un vendeur' })
    })
    .catch(err => {
      console.error(err)
      res.api.buildError(500, 'Error while returning a book')
    })
}

export const borrowBook: RequestHandler = function (req, res) {
  const { bookId } = req.params
  if (!(bookId && typeof bookId === 'string')) return res.api.buildBoard('borrowSummary', 'Id de livre incorrect', { book: { title: '' }, info: "Ce livre n'existe pas: Id de livre incorrect" })
  getBook(bookId)
    .then(async book => {
      if (!book || book.usedBy !== null) return res.api.buildBoard('borrowSummary', 'Livre inconnu', { book: { title: '' }, info: "Emprunt impossible: Livre inconnu ou déjà emprunté" })
      const successful = await arduino.getBook(book.bookId)
      if (!successful) return res.api.buildBoard('borrowSummary', "Le livre n'a pas pu être trouvé", { book, info: "Nous n'avons pas pu retrouver le livre dans notre banque. Veuillez contacter un vendeur." })
      await updateBookStatus(book._id, req.user!._id, 'WITHDRAW')
      return res.api.buildBoard('borrowSummary', 'Le livre a été emprunté', { book, info: 'Bonne lecture :)' })
    })
    .catch(err => {
      console.error(err)
      res.api.buildError(500, 'Error while borrowing a book')
    })
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
