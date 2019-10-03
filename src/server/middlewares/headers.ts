import express from 'express'

export default function (req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  // XXX: res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  next()
}
