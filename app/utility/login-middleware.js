    var config = require('../../config/config.js');

    module.exports = (req, res, next) => {

        const auth = {
            user: config.settingPageAuth.user,
            password: config.settingPageAuth.password
        }

        const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [user, password] = new Buffer(b64auth, 'base64').toString().split(':')

        if (!user || !password || user !== auth.user || password !== auth.password) {
            res.set('WWW-Authenticate', 'Basic realm="nope"')
            res.status(401).send('You shall not pass.')
            return
        } else {
            next();
        }
    }