'use strict';

module.exports = class Auth {
    constructor(password) {
        this._hash = new Buffer(password).toString('base64');
    }


    express(req, res, next) {
        const token = req.headers['authorization'];
        if (!token || token.length <= 0) {
            return res.status(403).send('no authorization token found');
        }

        if (token !== this._hash) {
            return res.status(403).send('wrong token');
        }

        next();
    }


    socketio(socket, next) {
        if (!socket.handshake.query || !socket.handshake.query.token ||
            socket.handshake.query.token.length <= 0) {
            return next(new Error('no token found'));
        }

        const token = socket.handshake.query.token;

        if (token !== this._hash) {
            return next(new Error('wrong token'));
        }

        next();
    }
};
