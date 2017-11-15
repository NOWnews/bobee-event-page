var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    facebookId: {
        type: Schema.Types.String,
        default: null
    },
    name: {
        type: Schema.Types.String,
        default: null
    },
    nickname: {
        type: Schema.Types.String,
        default: null
    },
    phone: {
        type: Schema.Types.String,
        default: null
    },
    email: {
        type: Schema.Types.String,
        default: null
    }
}, {
    timestamps: true
});

mongoose.model('User', UserSchema);