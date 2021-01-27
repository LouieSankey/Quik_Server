
const { expect } = require('chai')
const knex = require('knex')
const { patch } = require('../src/app')
const app = require('../src/app')
const testPins = require('./fixtures').makePins()


describe('Pins Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw("TRUNCATE TABLE pin_table RESTART IDENTITY CASCADE"))

  describe(`GET /pins`, () => {
    context('Given there are pins in the database', () => {

      before('insert pins', () => {
        return db
          .into('pin_table')
          .insert(testPins)
      })
      after('clean the table',
        () => db.raw("TRUNCATE TABLE pin_table RESTART IDENTITY CASCADE"))

      const pins_for_user_id_1 = [testPins[0], testPins[1]]

      it('GET /user_id/:user_id responds with 200 and all pins associated with a user id', () => {
        return supertest(app)
          .get('/pins_route/user_id/1')
          .expect(200, pins_for_user_id_1)
      })

      const user_id = { user_id: testPins[0].user_id }

      it('POST /connections responds with 201 and all pins associated with a connected user id', () => {
        return supertest(app)
          .post('/pins_route/connections')
          .send(user_id)
          .expect(201, [testPins[3]])
      })

      let pin = testPins[0]
      let location_date_id = pin.location_date_id
      let params = { location_date_id: location_date_id, user_id: pin.user_id, seeking: pin.seeking }

      it('POST /pins_route/matches/:location_date_id responds with 200 and users at a shared location-date-id', () => {
        return supertest(app)
          .post(`/pins_route/matches/${location_date_id}`)
          .send(params)
          .expect(201, [testPins[2], testPins[4]])
      })

    })

  })

  describe(`POST /pin`, () => {
  context('Given there are no pins in the database', () => {

    after('clean the table', () => db.raw("TRUNCATE TABLE pin_table RESTART IDENTITY CASCADE"))

    const newPin = {
      id: 1,
      location_date_id:  "date-unique-location-id-3",
      pin_date:  "10-10-1010",
      location_id:  "unique-location-id",
      user_id: 10,
      seeking:  "women",
      user_name:  "user10",
      age:  "32",
      bio:  "nothing",
      photo_url:  "nothing",
      likes_recieved:  [],
      likes_sent:  [],
      date_request_recieved:  [],
      date_request_sent:  [],
      date_location:  "name of venue",
      date_location_category:  "category of venue",
      date_published: '2029-01-22T16:28:32.615Z',
  }

    it('POST /pins_route/pin/ responds with 201 and adds a pin to the table', () => {
      return supertest(app)
        .post(`/pins_route/pin/`)
        .send(newPin)
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body.user_name).to.equal(newPin.user_name)
          expect(res.body.user_id).to.equal(newPin.user_id)
        })
    })

  })
})

})