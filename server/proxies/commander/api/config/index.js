'use strict';

const _ = require('lodash'),
    express = require('express'),
    tools = require('../tools');


module.exports = (config, manager) => {
    const router = express.Router();

    router.get('/', getConfig);
    router.patch('/', updateConfig);

    return router;


    ////////////

    function getConfig(req, res) {
        return res.send(
            tools.omitDeep(config, ['password', 'test'])
        );
    }

    function updateConfig(req, res) {
        const payload = tools.omitDeep(req.body, ['password', 'test']);

        if (payload.instance && payload.instance.scaling) {
            tools.checkScalingIntegrity(payload.instance.scaling);
        }

        const oldConfig = _.cloneDeep(config);

        _.merge(config, payload);

        if (_.isEqual(config, oldConfig)) {
            return res.sendStatus(204);
        }
        else {
            manager.emit('config:updated', config);

            return res.send(
                tools.omitDeep(config, ['password', 'test'])
            );
        }
    }
};
