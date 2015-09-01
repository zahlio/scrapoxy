module.exports = isAuthenticated;


////////////

function isAuthenticated(req, res, next) {
    var configPassword = req.app.get('config').commander.password;
    if (!configPassword || configPassword.length <= 0) {
        return res.status(403).send('no password in configuration');
    }

    var token = req.headers['authorization'];
    if (!token || token.length <= 0) {
        return res.status(403).send('no authorization token found');
    }

    var hashPassword = new Buffer(configPassword).toString('base64');
    if (token !== hashPassword) {
        return res.status(403).send('wrong token');
    }

    next();
}
