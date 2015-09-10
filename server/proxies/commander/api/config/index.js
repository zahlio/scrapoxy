'use strict';

var _ = require('lodash'),
    express = require('express'),
    tools = require('../tools');


module.exports = createRouter;


////////////

function createRouter(config, manager) {
    var router = express.Router();

    router.get('/', getConfig);
    router.patch('/', updateConfig);

    return router;


    ////////////

    function getConfig(req, res) {
        var viewConfig = tools.omitDeep(config, ['password', 'test']);

        return res.status(200).send(viewConfig);
    }

    function updateConfig(req, res) {
        var payload = req.body;

        payload = tools.omitDeep(payload, ['password', 'test']);

        if (payload.instance && payload.instance.scaling) {
            tools.checkScalingIntegrity(payload.instance.scaling);
        }

        var oldConfig = _.cloneDeep(config);

        config = _.merge(config, payload);

        if (_.isEqual(config, oldConfig)) {
            return res.sendStatus(204);
        }
        else {
            manager.emit('config:updated', config);

            var viewConfig = tools.omitDeep(config, ['password', 'test']);

            return res.status(200).send(viewConfig);
        }
    }


}