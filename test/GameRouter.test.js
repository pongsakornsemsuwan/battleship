const httptest = require('supertest');
const GameModel = require('../models/Game.model')


describe('/GET game', () => {

  let server;
  beforeAll(function () {
    server = require('../server');
  });
  afterAll(function (done) {
    server.close(done);
  });

  it('return a new instance of game', (done) => {
    httptest(server)
      .get('/api/game/')
      .end((err, res) => {
        try {
          expect(err).toBeNull()
          expect(res.status).toEqual(200)
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('updatedAt');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('hitCount', 0);
          expect(res.body).toHaveProperty('shootCount', 0);
          expect(res.body).toHaveProperty('shipLeft', 0);
          expect(res.body).toHaveProperty('totalShip', 0);
          expect(res.body).toHaveProperty('status', 'prepare');
          expect(res.body).toHaveProperty('ships', []);

          done()
        } catch (err) {
          done.fail(err)
        }
      })
  })

  it('return a new instance of game', (done) => {
    let game = new GameModel();
    game.status = 'prepare'
    game.totalShip = 0;
    game.shipLeft = 0;
    game.shootCount = 0;
    game.hitCount = 0;
    game.save((err, game)=>{
      httptest(server)
        .get('/api/game/' + game._id)
        .end((err, res) => {
          try {
            expect(err).toBeNull()
            expect(res.status).toEqual(200)
            expect(res.body).toHaveProperty('_id', game._id.toString());
            expect(res.body).toHaveProperty('updatedAt');
            expect(res.body).toHaveProperty('createdAt');
            expect(res.body).toHaveProperty('hitCount', 0);
            expect(res.body).toHaveProperty('shootCount', 0);
            expect(res.body).toHaveProperty('shipLeft', 0);
            expect(res.body).toHaveProperty('totalShip', 0);
            expect(res.body).toHaveProperty('status', 'prepare');
            expect(res.body).toHaveProperty('ships', []);

            done()
          } catch (err) {
            done.fail(err)
          }
        })
    })
  })

})
