// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameLogSchema = new Schema({
    facebookId: {
        type: String,
        required: true,
        default: null
    },
    result: {
        type: String,
        required: true,
        enum: ['holy', 'smile', 'negative'],
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('GameLog', GameLogSchema);