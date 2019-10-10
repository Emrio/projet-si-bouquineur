import path from 'path'
import express from 'express'
import ejs from 'ejs'
import _ from 'lodash'
import { Base64 } from 'js-base64'

type ResponseCode = 200 | 400 | 401 | 403 | 404 | 405 | 429 | 500 | 501 | 503

export default function (req: express.Request, res: express.Response, next: express.NextFunction): void {
  function buildBoard (filepath: string, pagetitle: string, opts?: any) {
    ejs.renderFile(path.join(__dirname, '../../../..', req.app.get('views'), 'pages', filepath + '.ejs'), _.merge(res.locals, opts), (err, str) => {
      if (err || !str) {
        console.error(err)
        return res.api.send(500, { error: "Couldn't render the page" })
      }
      return res.api.send(200, { data: { page: Base64.encode(str), title: pagetitle } })
    })
  }

  function buildError (code: ResponseCode, message: string) {
    buildBoard('error', `Erreur ${code}`, { err: { code, message } })
  }

  function sendAPI (code: ResponseCode, additionalInfo: any) {
    var message = { 200: 'Request Succeeded', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Ressource Forbidden', 404: 'Ressource Not Found', 405: 'Method Not Allowed', 429: 'Too Many Requests', 500: 'Internal Server Error', 501: 'Not Implemented', 503: 'Service Not Available' }[code] || 'Unknown Error'
    return res.status(code).json(_.merge({ code: code, message: message }, additionalInfo))
  }

  res.api = { send: sendAPI, buildBoard, buildError }
  next()
}
