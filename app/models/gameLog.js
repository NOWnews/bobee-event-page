// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameLogSchema = new Schema({

    facebookId: {
        type: String,
        default: null
    },
    facebookEmail: {
        type: String,
        default: null
    },
    isWin: {
        type: Boolean,
        default: null
    }

}, {
    timestamps: {}
});

mongoose.model('GameLog', GameLogSchema);