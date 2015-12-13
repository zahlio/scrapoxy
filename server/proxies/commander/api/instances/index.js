'use strict';

const Router = require('koa-router');


module.exports = (manager) => {
    const router = new Router();

    router.get('/', getInstances);
    router.post('/stop', removeInstance);

    return router.routes();


    ////////////

    function *getInstances() {
        this.status = 200;
        this.body = manager.stats;
    }

    function *removeInstance() {
        const name = this.request.body['name'];
        if (!name || name.length <= 0) {
            throw new Error('Name not found');
        }

        const promise = manager.removeInstance(name);
        if (!promise) {
            this.status = 404;
            this.body = `Proxy ${name} not found`;
            return;
        }

        yield promise;

        this.status = 200;
        this.body = {
            alive: manager.aliveInstances.length,
        };
    }
};
