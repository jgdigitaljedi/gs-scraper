const mongoose = require('mongoose');
const format = require('date-fns/format');

const resultSchema = new mongoose.Schema({
  savedDate: {
    type: String,
    required: true
  },
  link: {
    required: true,
    type: String
  },
  title: {
    type: String
  },
  price: {
    type: Number
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  source: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  key: {
    type: String
  },
  date: {
    type: String
  },
  action: {
    type: String,
    required: true
  }
});

resultSchema.methods.timestamp = function () {
  this.savedDate = format(new Date(), 'MM/DD/YYYY hh:mm a');
};

mongoose.model('Result', resultSchema);
