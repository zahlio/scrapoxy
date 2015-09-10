'use strict';

module.exports = Auth;


////////////

function Auth(password) {
    this._hash = new Buffer(password).toString('base64');
}


Auth.prototype.express = function expressFn(req, res, next) {
    var token = req.headers['authorization'];
    if (!token || token.length <= 0) {
        return res.status(403).send('no authorization token found');
    }

    if (token !== this._hash) {
        return res.status(403).send('wrong token');
    }

    next();
};


Auth.prototype.socketio = function socketioFn(socket, next) {
    if (!socket.handshake.query
        || !socket.handshake.query.token
        || socket.handshake.query.token.length <= 0) {
        return next(new Error('no token found'));
    }

    var token = socket.handshake.query.token;

    if (token !== this._hash) {
        return next(new Error('wrong token'));
    }

    next();
};
