import { RequestHandler } from 'express'

export const showPage: RequestHandler = function (_req, res) {
  res.render('app')
}
