const SHIP_SIZE = require('../config.json').shipSize;
const SHIP_COUNT = require('../config.json').shipCount;
const GameModel = require('../models/Game.model')
const GameService = require('./GameService')
const Constants = require('../utils/Constants')

const FleetService = {

  autogen : async function(gameId){
    try {
      let game = await GameModel.findById( gameId );

      for (let shipType in SHIP_COUNT) {
        if (SHIP_COUNT.hasOwnProperty(shipType)) {
          let existingCount = game.ships.filter( (ship)=>{
            return ship.shipType === shipType
          }).length;
          for( let i=existingCount; i<SHIP_COUNT[shipType];i++){
            let newShip = await this.genShip(shipType);
            let result = await this.addShip(gameId, newShip);
            while( !result){
              newShip = await this.genShip(shipType);
              result = await this.addShip(gameId, newShip);
            }
          }
        }
      }

      return await GameModel.findById( gameId );
    }catch(err){
      throw err;
    }
  },

  genShip : function(shipType){
    try {
      let newShip = {
        shipType : shipType,
        orientation : Math.round(Math.random() * 1) === 0 ? Constants.ORIEN_HORIZONTAL : Constants.ORIEN_VERTICAL
      }

      let coords = [];
      x = Math.round(Math.random() * 9);
      y = Math.round(Math.random() * 9);

      for(let i=0;i<SHIP_SIZE[shipType];i++){
        if(newShip.orientation === Constants.ORIEN_HORIZONTAL){
          coords.push({x:x+i,y:+y});
        }else if(newShip.orientation === Constants.ORIEN_VERTICAL){
          coords.push({x:+x,y:y+i});
        }
      }
      newShip.coords = coords;

      return newShip;
    }catch(err){
      throw err;
    }
  },

  addShip : async function(gameId, ship, res){
    try {
      let game = await GameModel.findById( gameId );

      if(!game){
        return false;
      }

      if(GameService.validateShipPlacement(game.ships, ship)){
  			game.ships.push(ship);
  			game.totalShip = game.totalShip + 1;
  			game.shipLeft = game.shipLeft + 1;
  			await game.save();
        return game;
      }

      return false;
    }catch(err){
      throw err;
    }
  }
}

module.exports = FleetService;
