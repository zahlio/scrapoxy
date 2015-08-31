module.exports = isAuthenticated;


////////////

function isAuthenticated(req, res, next) {
    var config = req.app.get('config');

    var token = req.headers['authorization'];

    if (token !== config.password) {
        return res.status(403).send('wrong token');
    }

    next();
}
