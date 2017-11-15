var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    GameLog = mongoose.model('GameLog'),
    User = mongoose.model('User'),
    Chart = mongoose.model('Chart'),
    moment = require('moment-timezone'),
    config = require('../../config/config.js'),
    gameConfig = require('../../config/gameConfig.js'),
    MobileDetect = require('mobile-detect'),
    axios = require('axios'),
    Debug = require('debug'),
    _ = require('lodash'),
    debug = Debug('bobee-event-page/app/controllers/home'),
    Joi = require('joi');

module.exports = function(app) {
    app.use('/', router);
};


router.get('/', function(req, res, next) {
    md = new MobileDetect(req.headers['user-agent']);
    var md = new MobileDetect(req.headers['user-agent']);
    var isMobileOrTablet = md.mobile() || md.tablet() || false;
    res.render('index', {
        isMobileOrTablet: isMobileOrTablet,
        facebookAppId: config.facebook.appId,
        NODE_ENV: process.env.NODE_ENV || 'development'
    });
});

router.post('/login', async(req, res) => {
    try {
        if (req.session.user && req.session.user.facebookId === req.body.authResponse.userID) {
            debug(`User ${req.session.user.facebookId} has logined!!`);
            if (!req.session.user.name || !req.session.user.nickname || !req.session.user.phone || !req.session.user.email) {
                return res.json({
                    hasContactInfo: false
                });
            }
            return res.json({
                hasContactInfo: true
            });
        }
        var {
            authResponse: {
                accessToken,
                userID
            }
        } = req.body;

        var fbApi = 'https://graph.facebook.com/me?';
        var queryStr = `access_token=${accessToken}`
        var {
            data
        } = await axios.get(`${fbApi}${queryStr}`);

        if (!data) {
            throw new Error('使用者提供的Token不正確或Facebook API壞掉');
        }

        var user = await User.findOne({
            facebookId: data.id
        });

        if (!user) {
            user = await User.create({
                facebookId: data.id
            });
            debug(`User ${user.facebookId} has created!!`);
        }

        req.session.user = user;
        debug(`User ${req.session.user.facebookId} has logined!!`);

        if (!user.name || !user.nickname || !user.phone || !user.email) {
            return res.json({
                hasContactInfo: false
            });
        }
        return res.json({
            hasContactInfo: true
        });

    } catch (err) {
        console.error('post /login err', err);
        return res.sendStatus(500);
    }
}, (req, res) => {

});

router.get('/play', async function(req, res) {
    try {
        /* 擲杯的機率
         *  2/4 聖杯, 1/4 笑杯, 1/4 陰杯
         */
        var results = ['holy', 'holy', 'smile', 'negative'];
        //test
        // results = results.concat(['holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy', 'holy'])
        //test
        var randomIndex = Math.floor(Math.random() * results.length);
        var randomResult = results[randomIndex];

        var todayStart = moment.tz('Asia/Taipei').startOf('day');
        var todayEnd = moment.tz('Asia/Taipei').endOf('day');

        debug('req.session.user.facebookId', req.session.user.facebookId);

        var todayNotHolyGameCount = await GameLog.find({
                facebookId: req.session.user.facebookId,
                createdAt: {
                    $gte: todayStart,
                    $lte: todayEnd
                }
            })
            .where('result').ne('holy')
            .count();

        var dailyPlayLimit = gameConfig.dailyPlayLimit;
        debug('todayNotHolyGameCount', todayNotHolyGameCount);

        if (todayNotHolyGameCount < dailyPlayLimit) {
            await GameLog.create({
                facebookId: req.session.user.facebookId,
                result: randomResult
            })
        } else {
            return res.json({
                overGameLimit: true
            });
        }
        var hasNextGame = (todayNotHolyGameCount + 1) < dailyPlayLimit;

        res.json({
            result: randomResult,
            hasNextGame: hasNextGame
        });
    } catch (err) {
        console.error('get /play err', err);
    }

});

router.get('/statistic', async function(req, res) {
    var allUserGameLog = await GameLog.find({
        facebookId: req.session.user.facebookId
    }).sort({
        'createdAt': -1
    });

    //計算歷史最高連續聖杯數
    var mostHolyCount = 0;
    var count = 0;
    var isHoly = false;

    //計算是今日第幾個機會數
    var todayGameLog = [];
    var todayOppotunity = gameConfig.dailyPlayLimit;
    var todayStart = moment.tz('Asia/Taipei').startOf('day');
    var todayEnd = moment.tz('Asia/Taipei').endOf('day');

    //計算目前有幾個連續聖杯
    var passFirstNoHoly = false;
    var currentComboNumber = 0;

    _.forEach(allUserGameLog, log => {

        //計算歷史最高連續聖杯數
        isHoly = log.result === 'holy';
        if (isHoly) {
            ++count;
        } else {
            count = 0;
        }
        if (count > mostHolyCount) {
            mostHolyCount = count;
        }

        //計算是今日第幾個機會數
        var createdAt = moment.tz(log.createdAt, 'Asia/Taipei');
        if (createdAt.isSameOrAfter(todayStart) && createdAt.isSameOrBefore(todayEnd)) {
            todayGameLog.push(log);
        }
    });
    //計算是今日第幾個機會數
    _.forEach(todayGameLog, log => {
        if (log.result === 'holy' && !passFirstNoHoly) {
            ++currentComboNumber;
        } else {
            passFirstNoHoly = true;
        }
        if (!passFirstNoHoly) {}
        if (log.result !== 'holy') {
            --todayOppotunity;
        }
    });

    debug('stat %o', {
        mostHolyCount,
        todayOppotunity
    });
    res.json({
        mostHolyCount,
        todayOppotunity,
        currentComboNumber
    })

});

router.get('/chart', async function(req, res) {
    try {
        req.query.perpage = parseInt(req.query.perpage, 10);
        req.query.page = parseInt(req.query.page, 10);

        var perPage = req.query.perpage || 10;
        var page = req.query.page >= 1 ? req.query.page : 1;
        var skip = page > 1 ? (page - 1) * perPage : 0;
        var nickname = req.query.nickname;

        debug('obj %o', {
            perPage,
            page,
            skip
        });

        debug('nickname..', nickname);
        var cursor = Chart.find({});
        var totalCursor = Chart.find({});
        if (nickname) {
            cursor.where({
                nickname: new RegExp(nickname, 'i')
            });
            totalCursor.where({
                nickname: new RegExp(nickname, 'i')
            });

        }
        debug('perPage...', perPage);
        var chart = await totalCursor
            .limit(perPage)
            .skip(skip);
        var chartCount = await totalCursor.count();

        var totalPage = Math.ceil(chartCount / perPage);
        var hasPrevPage = (page - 1) >= 1;
        var hasNextPage = (page + 1) <= totalPage;
        var currentPage = page;
        // hasPrevPage = true;
        // hasNextPage = true;
        var pageData = {
            totalPage,
            hasPrevPage,
            hasNextPage,
            currentPage
        };
        debug('chart %j', chart);
        // res.json({
        //     chart,
        //     chartCount,
        //     hasPrevPage,
        //     hasNextPage
        // });

        res.render('chart', {
            chart,
            chartCount,
            pageData,
            NODE_ENV: process.env.NODE_ENV || 'development'
        });
    } catch (err) {
        console.error('/get charts error', err);
    }
});


router.post('/contactInfo', async function(req, res, next) {
    try {
        // user input validation

        const schema = Joi.object().keys({
            name: Joi.string().max(30).required(),
            nickname: Joi.string().max(30).required(),
            phone: Joi.number().max(30).required(),
            email: Joi.string().email().required()
        });
        debug('contactInfo data %j', req.body);
        const result = Joi.validate(req.body, schema);
        debug('result.error', result.error);
        if (result.error) {
            return res.status(400).send(result.error.details);
        }
        next();

    } catch (err) {
        console.error('post /contactInfo validation', err);
    }

}, async function(req, res) {
    try {
        var {
            name,
            nickname,
            phone,
            email
        } = req.body;

        var user = await User.findOneAndUpdate({
            facebookId: req.session.user.facebookId,
        }, {
            name,
            nickname,
            phone,
            email
        }, {
            upsert: true
        });
        req.session.user = user;
        return res.sendStatus(200);
    }catch(err){
        console.error('post /contactInfo', err);
    }

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