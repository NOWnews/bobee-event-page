// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({

    facebookId: {
        type: String,
        default: null
    },
    facebookEmail: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },

}, {
    timestamps: {}
});

mongoose.model('Contact', ContactSchema);