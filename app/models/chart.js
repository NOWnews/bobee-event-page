// Example model
import moment from 'moment-timezone';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChartSchema = new Schema({
     nickname: {
        type: Schema.Types.String,
        required: true,
        default: null
    },
    facebookId: {
        type: Schema.Types.String,
        required: true,
        default: null
    },
    mostHolyCount: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    reachedTime: {
        type: Schema.Types.Date,
        required: true
    }

}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true
    }
});

ChartSchema.virtual('formatReachedTime').get(function() {
    return moment.tz(this.reachedTime, 'Asia/Taipei').format('YYYY/MM/DD HH:mm:ss');
});

mongoose.model('Chart', ChartSchema);