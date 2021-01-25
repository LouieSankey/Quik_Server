
const { expect } = require('chai')
const knex = require('knex')
const { patch } = require('../src/app')
const app = require('../src/app')
const testChat = require('./fixtures').makeChat()


describe('Chat Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('clean the table', () => db.raw("TRUNCATE TABLE chat_table RESTART IDENTITY CASCADE"))

    describe(`GET /chat_route/room_id/`, () => {
        context('Given there are messages in the database', () => {
            before('insert message', () => {
                return db
                    .into(`chat_table`)
                    .insert(testChat)
            })
            after('clean the table',
                () => db.raw("TRUNCATE TABLE chat_table RESTART IDENTITY CASCADE"))

            const room_id = testChat[0].room_id

            it('GET /chat_route/room_id/ responds with 200 and all chat messages associated with a room id', () => {
                return supertest(app)
                    .get(`/chat_route/room_id/${room_id}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an('array')
                        expect(res.body[0]).to.be.an('object')
                        expect(res.body[0].room_id).to.equal(testChat[0].room_id)
                    })
            })

        })

    })

})