var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    facebookId: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    nickname: {
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
    }
}, {
    timestamps: true
});

mongoose.model('User', UserSchema);