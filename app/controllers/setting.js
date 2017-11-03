var express = require('express'),
    router = express.Router(),
    moment = require('moment-timezone'),
    gameConfig = require('../../config/gameConfig.js'),
    loginMiddleware = require('../utility/login-middleware.js'),
    fs = require('fs'),
    path = require('path');

module.exports = function(app) {
    app.use('/setting', router);
};

router.get('/', loginMiddleware, function(req, res, next) {
    res.render('setting', {
        gameConfig
    });
});

router.post('/', loginMiddleware, function(req, res, next) {

    gameConfig.dailyPlayLimit = parseInt(req.body.dailyPlayLimit);
    gameConfig.winRate = parseInt(req.body.winRate);
    let gameConfigJson = JSON.stringify(gameConfig);
    let writeString = `module.exports = ${gameConfigJson}`;


    fs.writeFile(path.resolve(__dirname, '../../', 'config', 'gameConfig.js'), writeString, function(err) {
        if (err) throw err;
        fs.readFile(path.resolve(__dirname, '../../', 'config', 'gameConfig.js'), (err, data) => {
            gameConfig = require('../../config/gameConfig.js'),
                res.render('setting', {
                    gameConfig,
                    success: "更新成功"
                });
        })
    });

});