const express = require('express')
const xss = require('xss')
const path = require('path')
const PinService = require('./pins_service')
const pinRouter = express.Router()
const jsonParser = express.json()


//use to add new pins for any user
pinRouter
  .route('/pin/')
  .post(jsonParser, (req, res, next) => {
    const { location_date_id, pin_date, location_id, user_id, seeking, user_name, age, bio, photo_url } = req.body
    const newPin = { location_date_id, pin_date, location_id, user_id, seeking, user_name, age, bio, photo_url }

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

  //use to get the current users active pins
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
  // .post(jsonParser, (req, res, next) => {
  //   const { location_date_id, user_id, seeking } = req.body
  //   const params = { location_date_id, user_id, seeking }

  //   for (const [key, value] of Object.entries(newPin)) {
  //            if (value == null) {
  //              return res.status(400).json({
  //                error: { message: `Missing '${key}' in request body` }
  //              })
  //            }
  //          }

  //   PinService.getByUserId(
  //     req.app.get('db'),
  //     params
  //   )
  //     .then(user => {
  //       res
  //         .status(201)
  //         .location(path.posix.join(req.originalUrl, `/${user.id}`))
  //         .json(pin)
  //     })
  //     .catch(next)
  // })

  //use after getting all 5 current location-dates for a user, query here 5 times to get all matches
  pinRouter
  .route('/matches/:location_date_id')
  // .all((req, res, next) => {

  //   console.log(req)
  //        PinService.getByLocationDateId(
  //          req.app.get('db'),
  //          req.params.location_date_id
         
  //        )
  //          .then(pin => {
              
  //            if (!pin) {
  //              return res.status(404).json({
  //                error: { message: `pin doesn't exist` }
  //              })
  //            }
  //            res.pin = pin 
  //            next() 
  //          })
  //          .catch(next)
  //      })
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

module.exports = pinRouter