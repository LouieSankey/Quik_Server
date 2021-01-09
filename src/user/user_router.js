const express = require('express')
const xss = require('xss')
const path = require('path')
const jwt = require('jsonwebtoken');

const UserService = require('./user_service')

const userRouter = express.Router()
const jsonParser = express.json()

userRouter
  .route('/')
  .get((req, res, next) => {
    UserService.getAllUsers(
      req.app.get('db')
    )
      .then(users => {
        //will need to hide passwords here
        res.json(users)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { email, username, password, birthday, seeking } = req.body
    const newUser = { email, username, birthday, password, seeking }

    for (const [key, value] of Object.entries(newUser)) {
             if (value == null) {
               return res.status(400).json({
                 error: { message: `Missing '${key}' in request body` }
               })
             }
           }

    UserService.insertUser(
      req.app.get('db'),
      newUser
    )
      .then(user => {
        user.password = "xxxxxxxxx"
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(user)
      })
      .catch(next)
  })


  userRouter
  .route('/email/:email')
  .all((req, res, next) => {

    UserService.getByEmail(
      req.app.get('db'),
      req.params.email
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `user doesn't exist` }
          })
        }
        res.user = user 
        next() 
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {

    const { body } = req;
    const { email } = body;
    const { password } = body;

    if (email === res.user.email && password === res.user.password) {

      const user = res.user
      jwt.sign({ user }, 'privatekey', { expiresIn: '1h' }, (err, token) => {
        if (err) { console.log(err) }
        res.json({
          id: res.user.id,
          email: res.user.email,
          username: xss(res.user.username),
          brithday: xss(res.user.birthday),
          seeking: xss(res.user.seeking),
          date_published: res.user.date_published,
          token: token
        })

      });


    } else {
      return res.status(404).json({
        error: { message: `Incorrect Password` }
      })
    }


  })

userRouter
  .route('/:user_id')
  .all((req, res, next) => {
         UserService.getById(
           req.app.get('db'),
           req.params.user_id
         )
           .then(user => {
             if (!user) {
               return res.status(404).json({
                 error: { message: `user doesn't exist` }
               })
             }
             res.user = user // save the user for the next middleware
             next() // don't forget to call next so the next middleware happens!
           })
           .catch(next)
       })
  .get((req, res, next) => {
    res.json({
                   id: res.user.id,
                   username: xss(res.user.username), 
                   email: xss(res.user.email), 
                   date_published: res.user.date_published,
                 })
  })
  .delete((req, res, next) => {
    UserService.deleteUser(
             req.app.get('db'),
             req.params.user_id
           )
             .then(() => {
               res.status(204).end()
             })
             .catch(next)
       })

       .patch(jsonParser, (req, res, next) => {
           const { email, username, password, seeking  } = req.body
           const userToUpdate = { email, username, password, seeking  }

           const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
             if (numberOfValues === 0) {
               return res.status(400).json({
                 error: {
                   message: `Request body must contain a required field'`
                 }
               })
             }

           UserService.updateUser(
                 req.app.get('db'),
                 req.params.user_id,
                 userToUpdate
               )
                 .then(numRowsAffected => {
                   res.status(204).end()
                 })
                 .catch(next)

         })

module.exports = userRouter