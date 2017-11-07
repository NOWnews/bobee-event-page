var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';
var config = {
    development: {
        root: rootPath,
        app: {
            name: 'bobee-event'
        },
        port: process.env.PORT || 8080,
        db: 'mongodb://localhost/bobee-event-development',
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
            name: 'bobee-event'
        },
        port: process.env.PORT || 80,
        db: 'mongodb://localhost/bobee-event-production',
        facebook: {
            appId: '781203158725096'
        },
        settingPageAuth: {
            user: 'nownews',
            password: '28331543'
        }
    }
};

module.exports = config[env];