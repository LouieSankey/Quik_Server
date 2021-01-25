
const { expect } = require('chai')
const knex = require('knex')
const { patch } = require('../src/app')
const app = require('../src/app')
const testUsers = require('./fixtures').makeUsers()


describe('Users Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw("TRUNCATE TABLE user_table RESTART IDENTITY CASCADE"))

  describe(`GET /users`, () => {
    context('Given there are users in the database', () => {

      before('insert users', () => {
        return db
          .into('user_table')
          .insert(testUsers)
      })

      it('GET /users responds with 200 and all of the users', () => {
        return supertest(app)
          .get('/user_route')
          .expect(200, testUsers)
      })

      it('should return the correct user when given an id', () => {

        const userId = 1
        const expectedUser = testUsers[userId - 1]
        const expectedElements = {
          id: expectedUser.id,
          username: expectedUser.username,
          email: expectedUser.email,
          date_published: expectedUser.date_published
        }

        return supertest(app)
          .get(`/user_route/${userId}`)
          .expect(200, expectedElements)
      })

      it('should delete the user when given an id', () => {

        const userId = 1
        return supertest(app)
        .delete(`/user_route/${userId}`)
        .then(() => {
          return supertest(app)
          .get('/user_route')
          .expect(200, [testUsers[1]])
      })
    
      })
      after('clean the table', () => db.raw("TRUNCATE TABLE user_table RESTART IDENTITY CASCADE"))
    })


    context('Given there are users in the database', () => {
      before('insert users', () => {
        return db
          .into('user_table')
          .insert(testUsers)
      })

      afterEach('clean the table', () => 
      db.raw("TRUNCATE TABLE user_table RESTART IDENTITY CASCADE"))


      it('should patch the user when given an id', () => {

        const expectedUser = testUsers[0]
        expectedUser.username = "newUsername"

        expectedElements = {
          id: expectedUser.id,
          username: expectedUser.username,
          email: expectedUser.email,
          date_published: expectedUser.date_published
        }
      
        return supertest(app)
        .patch(`/user_route/${expectedUser.id}`)
        .send(expectedUser)
        .then(() => {
          return supertest(app)
          .get(`/user_route/${expectedUser.id}`)
          .expect(200, expectedElements)
      })
    
      })

      

      it('should add a user', () => {

        const newUser = {
          username: "postedUser",
          email: "postedUser@gmail.com",
          password: "xxxxxxxxx",
          birthday: "birthday", 
          seeking: "seeking"
        }
      
        return supertest(app)
        .post(`/user_route/`)
        .send(newUser)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.username).to.equal(newUser.username)
        })

      })
    })
  })
})











