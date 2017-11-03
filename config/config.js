var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'ghost-festival'
        },
        port: process.env.PORT || 8080,
        db: 'mongodb://localhost/ghost-festival-development',
        facebook: {
            appId: '781203158725096'
        },
        settingPageAuth: {
            user: 'nownews',
            password: '28331543'
        }
    },
    production: {
        root: rootPath,
        app: {
            name: 'ghost-festival'
        },
        port: process.env.PORT || 8080,
        db: 'mongodb://localhost/ghost-festival-production',
        facebook: {
            appId: '426928670995788'
        },
        settingPageAuth: {
            user: 'nownews',
            password: '28331543'
        }
    }
};

module.exports = config[env];