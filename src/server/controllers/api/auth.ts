import { RequestHandler } from 'express'
import { User } from '../../../models/User'
import { arduino } from '../../../arduino'

export const login: RequestHandler = async function (req, res) {
  if (req.isAuthenticated()) {
    arduino.rfid.resetRFID()
    return res.api.send(200, { message: 'Already connected' })
  }
  if (!arduino.rfid.currentRFID) {
    arduino.rfid.resetRFID()
    return res.api.send(503, { message: 'No rfid card used' })
  }
  const rfid = req.body.rfid
  console.log(req.body, req.params, req.query)
  if (!rfid || typeof rfid !== 'string' || rfid !== arduino.rfid.currentRFID) {
    arduino.rfid.resetRFID()
    return res.api.send(400, { message: 'Incorrect input or incorrect password' })
  }
  const user = await User.findOne({ rfid })
  if (!user) {
    arduino.rfid.resetRFID()
    return res.api.send(404, { message: 'User does not exist' })
  }
  req.login(user, (err) => {
    if (err) {
      console.error(err)
      arduino.rfid.resetRFID()
      return res.api.send(500, {})
    }
    res.api.send(200, { message: 'Connected' })
  })
}

export const logout: RequestHandler = async function (req, res) {
  if (req.isAuthenticated()) {
    req.logout()
    arduino.rfid.resetRFID()
    return res.api.send(200, { message: 'Disconnected' })
  } else {
    return res.api.send(400, { message: 'Not connected' })
  }
}
