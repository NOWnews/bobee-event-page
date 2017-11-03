var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    GameLog = mongoose.model('GameLog'),
    Contact = mongoose.model('Contact'),
    moment = require('moment-timezone'),
    gameConfig = require('../../config/gameConfig.js'),
    config = require('../../config/config.js'),
    MobileDetect = require('mobile-detect')
module.exports = function(app) {
    app.use('/', router);
};


router.get('/', function(req, res, next) {
    md = new MobileDetect(req.headers['user-agent']);
    var md = new MobileDetect(req.headers['user-agent']);
    console.log('md.mobile()',md.mobile());
    console.log('md.tablet()',md.tablet());
    console.log(' md.mobile() || md.tablet() || false,', md.mobile() || md.tablet() || false);
    var isMobileOrTablet = md.mobile() || md.tablet() || false;
    res.render('index', {
        isMobileOrTablet : isMobileOrTablet,
        facebookAppId: config.facebook.appId,
        NODE_ENV : process.env.NODE_ENV || 'development'
    });
});

router.get('/test', function(req, res, next) {
    md = new MobileDetect(req.headers['user-agent']);
    var md = new MobileDetect(req.headers['user-agent']);
    console.log('md.mobile()',md.mobile());
    console.log('md.tablet()',md.tablet());
    console.log(' md.mobile() || md.tablet() || false,', md.mobile() || md.tablet() || false);
    var isMobileOrTablet = md.mobile() || md.tablet() || false;
    res.render('test', {
        isMobileOrTablet : isMobileOrTablet,
        facebookAppId: config.facebook.appId,
        NODE_ENV : process.env.NODE_ENV || 'development'
    });
});

router.get('/play',async function(req, res){
    /* 擲杯的機率
    *  2/4 聖杯, 1/4 笑杯, 1/4 陰杯
    */

    var results = ['holy', 'holy', 'smile', 'negative'];
    var randomIndex = Math.floor(Math.random() * results.length);
    var randomResult =  results[randomIndex];
    res.json({result : randomResult});
});

// router.post('/record', async function(req, res, next) {

//     let {
//         isWin,
//         facebookEmail,
//         facebookId
//     } = req.body;
//     if (!isWin || !facebookId) {
//         return res.send('Invalid Data');
//     }
//     let gameLog = await GameLog.create({
//         isWin,
//         facebookEmail,
//         facebookId
//     });

//     let contactCount = await Contact.count({
//         facebookId: facebookId
//     });

//     let hasContact = contactCount >= 1 ? true : false;
//     res.json({
//         hasContact
//     });

// });

// router.get('/todayScore', async function(req, res, next) {
//     let {
//         facebookId
//     } = req.query;
//     let todayWin = await GameLog.count({
//         facebookId: facebookId,
//         createdAt: {
//             $gte: moment.tz('Asia/Taipei').startOf('day'),
//             $lte: moment.tz('Asia/Taipei').endOf('day')
//         },
//         isWin: true
//     });

//     let todayLose = await GameLog.count({
//         facebookId: facebookId,
//         createdAt: {
//             $gte: moment.tz('Asia/Taipei').startOf('day'),
//             $lte: moment.tz('Asia/Taipei').endOf('day')
//         },
//         isWin: false
//     });

//     res.json({
//         todayWin,
//         todayLose
//     });
// });

// router.post('/leftCount', async function(req, res, next) {
//     let {
//         facebookId
//     } = req.body;
//     let todayCount = await GameLog.count({
//         facebookId: facebookId,
//         createdAt: {
//             $gte: moment.tz('Asia/Taipei').startOf('day'),
//             $lte: moment.tz('Asia/Taipei').endOf('day')
//         }
//     });
//     let leftCount = gameConfig.dailyPlayLimit - todayCount;
//     let dailyPlayLimit = gameConfig.dailyPlayLimit;

//     console.log('gameConfig', gameConfig);
//     console.log('gameConfig.dailyPlayLimit', gameConfig.dailyPlayLimit);
//     console.log('dailyPlayLimit', dailyPlayLimit);

//     res.json({
//         leftCount,
//         dailyPlayLimit
//     });

// });


// router.post('/contact', async function(req, res, next) {
//     let {
//         name,
//         phone,
//         facebookId,
//         facebookEmail
//     } = req.body;
//     console.log(facebookId, facebookEmail);
//     if (!name || !phone) {
//         return res.send('Invalid input');
//     }
//     let contact = await Contact.create({
//         name,
//         phone,
//         facebookId,
//         facebookEmail
//     });

//     res.send(201);

// });