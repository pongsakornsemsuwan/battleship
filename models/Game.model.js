const mongoose = require('mongoose')
const Schema = mongoose.Schema

let GameSchema = new Schema(
	{
    // one could argue to put ship in its separate model/document and link by ref
		ships: [ {
        shipType : String, // shipType
        coords : [
          {
            x : Number,
            y : Number
          }
        ],
        hitCoords : [
          {
            x : Number,
            y : Number
          }
        ],
        orientation : String //horizontal / vertical
    	} ],
		status : String,  //prepare, ready, end
    shootCount : Number,
    hitCount: Number,
    totalShip : Number,
    shipLeft : Number
	},
	{
		timestamps: true
	}
)

module.exports = mongoose.model('Game', GameSchema)
