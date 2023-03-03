var mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    frameName: {type: String, unique: true, required: true, dropDups: true},
    charaName: {type: String, required: true},
    costumes: [{
      skinName:  {type: String, unique: true, required: true, dropDups: true},
      price: [{
        value: {type: Number, required: [function() { return this.currency != null; }, "insert a value"]},
        currency: { type: String,
                    enum: { values: ["RC", "BC", "CB", "¥"], 
                    message: "pick a currency: RC, BC, CB, ¥"},
                    required: [function() { return this.value != null; }, "pick a currency: RC, BC, CB, ¥"]
        },
        name: {type: String, required: [function() { return this.value == null; }, "If no price is provided a message is required"]}
      }],
      event: [{
        start: {type: Date},
        finish: {type: Date},
        rerun: {type: Boolean, default: false},
        disc: {type: Boolean, default: false},
        name: {type: String, default: "-"},
        region: { type: String, enum: {
                  values: ["CN", "JP", "EN"], 
                  message: "pick a region: cn, jp, en"},
                  required: [function() { return this.start != null; }, "If a date is provided, please provide the region too"]
        }
      }]
    }]
  });
module.exports = mongoose.model('Character', characterSchema);