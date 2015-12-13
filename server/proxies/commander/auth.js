'use strict';

module.exports = class Auth {
    constructor(password) {
        this._hash = new Buffer(password).toString('base64');
    }


    *koa(ctx, next) {
        const token = ctx.request.header['authorization'];
        if (!token || token.length <= 0) {
            ctx.status = 403;
            ctx.body = 'no authorization token found';
            return;
        }

        if (token !== this._hash) {
            ctx.status = 403;
            ctx.body = 'wrong token';
            return;
        }

        yield next;
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
