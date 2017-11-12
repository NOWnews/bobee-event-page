// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChartSchema = new Schema({
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
    reachedTime:{
        type: Schema.Types.Date,
        required: true
    }

}, {
    timestamps: true
});

mongoose.model('Chart', ChartSchema);