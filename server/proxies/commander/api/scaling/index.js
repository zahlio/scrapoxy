'use strict';

const _ = require('lodash'),
    Router = require('koa-router'),
    tools = require('../tools');


module.exports = (config, manager) => {
    const router = new Router();

    router.get('/', getScaling);
    router.patch('/', updateScaling);

    return router.routes();


    ////////////

    function *getScaling() {
        this.status = 200;
        this.body = config.manager.scaling;
    }

    function *updateScaling() {
        const payload = this.request.body;

        tools.checkScalingIntegrity(payload);

        const scaling = config.manager.scaling,
            oldScaling = _.cloneDeep(scaling);

        _.merge(scaling, payload);

        if (_.isEqual(scaling, oldScaling)) {
            this.status = 204;
        }
        else {
            manager.emit('scaling:updated', scaling);

            this.status = 200;
            this.body = scaling;
        }
    }
};
