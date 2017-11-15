import moment from 'moment-timezone';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameLogSchema = new Schema({
    facebookId: {
        type: Schema.Types.String,
        required: true,
        default: null
    },
    result: {
        type: Schema.Types.String,
        required: true,
        enum: ['holy', 'smile', 'negative'],
        default: null
    }
}, {
    timestamps: true
});

GameLogSchema.virtual('formatCreatedAt').get(function() {
    return moment.tz(this.createdAt, 'Asia/Taipei').format('YYYY/MM/DD HH:mm:ss');
});


GameLogSchema.virtual('formatResult').get(function() {
    switch(this.result){
        case "smile":
            return "笑杯";
            break;
        case "negative":
            return "陰杯";
            break;
        case "holy":
            return "聖杯";
            break;
        default:
            return "";
    }
});

mongoose.model('GameLog', GameLogSchema);