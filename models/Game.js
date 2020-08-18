const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String,
  shortName: String,
  beginnerStats : mongoose.Schema.Types.Mixed,
  events : [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event' 
    }
  ],
  userInfos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserGameInfo"
    }
  ]
});

const schemaGameInfo = mongoose.Schema({
  stats : mongoose.Schema.Types.Mixed,
  game : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = {
  Game: mongoose.model("Game", schema),
  UserGameInfo: mongoose.model("UserGameInfo", schemaGameInfo),
};