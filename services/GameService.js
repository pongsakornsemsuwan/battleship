const SHIP_SIZE = require('../config.json').shipSize;
const SHIP_COUNT = require('../config.json').shipCount;
const Constants = require('../utils/Constants')
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

const GameService = {

  validateShipPlacement : function ( currentShips, newShip ){
    try {
      let grid = this.getGrid(currentShips);
      return this.checkShipCount(currentShips, newShip) && this.checkAdjacent(grid, newShip);
    }catch(err){
      throw err;
    }
  },

  getGrid : function(currentShips){
    try {
      let grid = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
      ]

      for(let i=0; i<currentShips.length;i++){
        let x = currentShips[i].coords[0].x;
        let y = currentShips[i].coords[0].y;

        for(let j=0; j < SHIP_SIZE[currentShips[i].shipType]; j++){

          let hitCoord = currentShips[i].hitCoords.filter( (hitCoord) => {
            if(hitCoord.x === x && hitCoord.y === y){
              return true;
            }
          })

          if(hitCoord.length > 0){
            grid[y][x] = 2;
          }else{
            grid[y][x] = 1;
          }

          if(currentShips[i].orientation === Constants.ORIEN_HORIZONTAL){
            x++;
          }else{
            y++;
          }
        }
      }

      // for(let i=0;i<grid.length;i++){
      //   for(let j=0;j<grid.length;j++){
      //     process.stdout.write(" " + grid[i][j] + " ");
      //   }
      //   process.stdout.write("\n");
      // }

      return grid;
    }catch(err){
      throw err;
    }
  },

  checkShipCount : function(currentShips, newShip){
    let shipType = newShip.shipType;

    let shipsWithSameType = currentShips.filter( (ship)=>{
      return ship.shipType === shipType;
    })

    if(shipsWithSameType.length < SHIP_COUNT[shipType]){
      return true;
    }
    return false;
  },

  checkAdjacent : function(grid, newShip){
    try {
      let y = newShip.coords[0].y;
      let x = newShip.coords[0].x;
      let orientation = newShip.orientation;
      let shipSize = SHIP_SIZE[newShip.shipType];

      if(orientation == Constants.ORIEN_HORIZONTAL && x+shipSize >= GRID_WIDTH) return false;
      if(orientation == Constants.ORIEN_VERTICAL && y+shipSize >= GRID_HEIGHT) return false;

      for(let i=0;i<shipSize;i++){

        //validate first point
        if(i == 0){

          if( y !== 0 ){
            if( x !== 0 && grid[y-1][x-1] === 1) return false;
            if(grid[y-1][x] === 1) return false;
            if( x < GRID_WIDTH-1 && grid[y-1][x+1] === 1) return false;
          }

          if( x !== 0 && grid[y][x-1] === 1) return false;
          if( grid[y][x] === 1 ) return false;
          if( x < GRID_WIDTH-1 && grid[y][x+1] === 1) return false;

          if( y < GRID_HEIGHT-1 ){
            if(x !== 0 && grid[y+1][x-1] === 1) return false;
            if( grid[y+1][x] === 1) return false;
            if(x < GRID_WIDTH-1 && grid[y+1][x+1] === 1) return false;
          }

        }else {

          if(orientation === Constants.ORIEN_VERTICAL){
            if( ( x > 0 && grid[y+i+1][x-1] == 1 ) ||
              grid[y+i+1][x] == 1 ||
              ( x+i < GRID_WIDTH - 1 && grid[y+i+1][x+1] == 1)){
              return false;
            }
          }

          if(orientation === Constants.ORIEN_HORIZONTAL){
            if( ( y > 0 && grid[y-1][x+i+1] == 1 ) ||
              grid[y][x+i+1] == 1 ||
              ( y+i < GRID_HEIGHT - 1 && grid[y+1][x+i+1] == 1  ) ){

              return false;
            }
          }
        }
      }
      return true;
    }catch(err){
      throw err;
    }
  },

  shoot : async function(x, y ,game){
    try{
      let result = '';
      game.shootCount++;

      let hitShips = game.ships.filter( (ship)=> {
        for(let i=0;i<ship.coords.length;i++){
          if(ship.coords[i].x === x && ship.coords[i].y === y){
            return true;
          }
        }
        return false;
      })

      //persist hit record
      if(hitShips.length > 0){
        game.hitCount++;
        hitShips[0].hitCoords.push({x:x,y:y});

        //sank
        if(hitShips[0].coords.length - hitShips[0].hitCoords.length === 0){
          game.shipLeft = game.shipLeft - 1;
          //end
          if(game.shipLeft === 0){
            game.status = 'end';
            result = 'Win ! You completed the game in ' + game.shootCount + ' moves (missed ' + (game.shootCount - game.hitCount) + ' times )';
          }else{
            result = 'You just sank the ' + hitShips[0].shipType;
          }
        }else{
          result = 'Hit';
        }
      }else{
        result = 'Miss';
      }

      game = await game.save();
      return result;

    }catch(err){
      throw err;
    }
  }
}

module.exports = GameService;
