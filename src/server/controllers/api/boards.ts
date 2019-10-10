import { RequestHandler } from 'express'

export const getWelcomePage: RequestHandler = function (_req, res) {
  return res.api.buildBoard('home', 'Bouquineur :: Welcome')
}

export const getDashboard: RequestHandler = function (_req, res) {
  return res.api.buildBoard('dashboard', 'Bouquineur :: Dashboard')
}

export const browseLibrary: RequestHandler = function (_req, res) {
  return res.api.buildBoard('browse', 'Bouquineur :: Browse Library')
}

export const myBooks: RequestHandler = function (_req, res) {
  return res.api.buildBoard('borrowed', 'Bouquineur :: Borrowed Books')
}
