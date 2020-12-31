//"example" will be replaced with the name of the table you are using CRUD on in the DB
const express = require('express')
const xss = require('xss')
const path = require('path')

const ExampleService = require('./example_service')

const exampleRouter = express.Router()
const jsonParser = express.json()

exampleRouter
  .route('/')
  .get((req, res, next) => {
    ExampleService.getAllExamples(
      req.app.get('db')
    )
      .then(examples => {
        res.json(examples)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content } = req.body
    const newExample = { title, content }

    for (const [key, value] of Object.entries(newExample)) {
             if (value == null) {
               return res.status(400).json({
                 error: { message: `Missing '${key}' in request body` }
               })
             }
           }

    ExampleService.insertExample(
      req.app.get('db'),
      newExample
    )
      .then(example => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${example.id}`))
          .json(example)
      })
      .catch(next)
  })

exampleRouter
  .route('/:example_id')
  .all((req, res, next) => {
         ExampleService.getById(
           req.app.get('db'),
           req.params.example_id
         )
           .then(example => {
             if (!example) {
               return res.status(404).json({
                 error: { message: `example doesn't exist` }
               })
             }
             res.example = example // save the example for the next middleware
             next() // don't forget to call next so the next middleware happens!
           })
           .catch(next)
       })
  .get((req, res, next) => {
    res.json({
                   id: res.example.id,
                   title: xss(res.example.title), // sanitize title
                   content: xss(res.example.content), // sanitize content
                   date_published: res.example.date_published,
                 })
  })
  .delete((req, res, next) => {
    ExampleService.deleteExample(
             req.app.get('db'),
             req.params.example_id
           )
             .then(() => {
               res.status(204).end()
             })
             .catch(next)
       })

       .patch(jsonParser, (req, res, next) => {
           const { title, content } = req.body
           const exampleToUpdate = { title, content }

           const numberOfValues = Object.values(exampleToUpdate).filter(Boolean).length
             if (numberOfValues === 0) {
               return res.status(400).json({
                 error: {
                   message: `Request body must contain either 'title' or 'content'`
                 }
               })
             }

           ExampleService.updateExample(
                 req.app.get('db'),
                 req.params.example_id,
                 exampleToUpdate
               )
                 .then(numRowsAffected => {
                   res.status(204).end()
                 })
                 .catch(next)

         })

module.exports = exampleRouter