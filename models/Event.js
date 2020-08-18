const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  rewards : mongoose.Schema.Types.Mixed,
  game : { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game' 
  }
});

module.exports = mongoose.model('Event', schema);