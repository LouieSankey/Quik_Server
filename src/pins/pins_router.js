const express = require('express')
const xss = require('xss')
const path = require('path')
const PinService = require('./pins_service')
const pinRouter = express.Router()
const jsonParser = express.json()


pinRouter
  .route('/pin/')

  .post(jsonParser, (req, res, next) => {
    const { location_date_id, pin_date, location_id, user_id, seeking, user_name, age, bio, photo_url, date_location, date_location_category } = req.body
    const newPin = { location_date_id, pin_date, location_id, user_id, seeking, user_name, age, bio, photo_url, date_location, date_location_category }

    for (const [key, value] of Object.entries(newPin)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    PinService.insertPin(
      req.app.get('db'),
      newPin
    )
      .then(pin => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${pin.id}`))
          .json(pin)
      })
      .catch(next)
  })

pinRouter
  .route('/user_id/:user_id')
  .all((req, res, next) => {
    PinService.getByUserId(
      req.app.get('db'),
      req.params.user_id
    )
      .then(pin => {
        if (!pin) {
          return res.status(404).json({
            error: { message: `pin doesn't exist` }
          })
        }
        res.pin = pin
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.pin)
  })

pinRouter
  .route('/connections')
  .post(jsonParser, (req, res, next) => {
    const { user_id } = req.body
    const params = { user_id }

    console.log(user_id)


    PinService.getConnections(
      req.app.get('db'),
      params
    )
      .then(pin => {
        console.log("ppin " + pin)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${pin.id}`))
          .json(pin)
      })
      .catch(next)
  })


pinRouter
  .route('/matches/:location_date_id')
  .post(jsonParser, (req, res, next) => {
    const { location_date_id, user_id, seeking } = req.body
    const params = { location_date_id, user_id, seeking }

    PinService.getByLocationDateId(
      req.app.get('db'),
      params
    )
      .then(pin => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${pin.id}`))
          .json(pin)
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { location_date_id, own_id, others_id } = req.body
    const params = { location_date_id, own_id, others_id }

    for (const [key, value] of Object.entries(params)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    PinService.sendLike(
      req.app.get('db'),
      params
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


pinRouter
  .route('/matches/request/:location_date_id')

  .patch(jsonParser, (req, res, next) => {
    const { location_date_id, own_id, others_id } = req.body
    const params = { location_date_id, own_id, others_id }

    for (const [key, value] of Object.entries(params)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    PinService.requestDate(
      req.app.get('db'),
      params
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = pinRouter