const httptest = require('supertest');
const GameModel = require('../models/Game.model')
const FleetService = require('../services/FleetService')

describe('/POST shoot router', async () => {

  let server;
  let gameModel = new GameModel();

  beforeAll(async function () {
    server = require('../server');

    gameModel.status = 'prepare'
    gameModel.totalShip = 0;
    gameModel.shipLeft = 0;
    gameModel.shootCount = 0;
    gameModel.hitCount = 0;
    gameModel.ships = [];
    let ship = {
      shipType: 'cruiser',
      coords:[{x:5,y:5},{x:6,y:5}],
      orientation: 'horizontal',
      hitCoords: []
    };

    let ship2 = {
      shipType: 'cruiser',
      coords:[{x:0,y:0},{x:0,y:1}],
      orientation: 'vertical',
      hitCoords: []
    };
    gameModel = await gameModel.save()
    gameModel = await FleetService.addShip(gameModel._id, ship);
    gameModel = await FleetService.addShip(gameModel._id, ship2);
  });
  afterAll(function (done) {
    server.close(done);
  });

  it('return correct result', (done) => {

    httptest(server)
    .post('/api/shoot')
    .send({ x: 5, y: 5, _id: gameModel._id })
    .end(function (err, res){
        expect(res.text).toEqual('Hit');
        done();
    })
  })

  it('return correct result', (done) => {
    httptest(server)
    .post('/api/shoot')
    .send({ x: 4, y: 5, _id: gameModel._id })
    .end(function (err, res){
        expect(res.text).toEqual('Miss');
        done();
    })
  })

  it('return correct result', (done) => {
    httptest(server)
    .post('/api/shoot')
    .send({ x: 6, y: 5, _id: gameModel._id })
    .end(function (err, res){
        expect(res.text).toEqual('You just sank the cruiser');
        done();
    })
  })

  it('return correct result', (done) => {
    httptest(server)
    .post('/api/shoot')
    .send({ x: 0, y: 0, _id: gameModel._id })
    .end(function (err, res){
        expect(res.text).toEqual('Hit');
        done();
    })
  })

  it('return correct result', (done) => {
    httptest(server)
    .post('/api/shoot')
    .send({ x: 0, y: 1, _id: gameModel._id })
    .end(function (err, res){
        expect(res.text).toEqual('Win ! You completed the game in 5 moves (missed 1 times )');
        done();
    })
  })
})
