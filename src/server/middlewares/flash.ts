import express from 'express'

export default function (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.session && req.session.flash) {
    res.locals.flash = req.session.flash
    req.session.flash = undefined
  }

  req.flash = function (type: 'error' | 'info' | 'warning' | 'success', content: string): void {
    if (!req.session) return
    if (!req.session.flash) req.session.flash = {}

    req.session.flash[type] = content
    res.locals.flash = req.session.flash
  }

  next()
}
