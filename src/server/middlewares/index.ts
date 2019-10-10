import express from 'express'
import flash from './flash'
import headers from './headers'
import api from './api'

export default function (server: express.Application): void {
  server.use(flash)
  server.use(headers)
  server.use(api)
}
