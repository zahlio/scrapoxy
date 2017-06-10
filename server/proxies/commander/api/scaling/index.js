'use strict';

const _ = require('lodash'),
    express = require('express'),
    tools = require('../tools');


module.exports = (config, manager) => {
    const router = express.Router();

    router.get('/', getScaling);
    router.patch('/', updateScaling);

    return router;


    ////////////

    function getScaling(req, res) {
        return res.send(config.instance.scaling);
    }

    function updateScaling(req, res) {
        const payload = req.body;

        tools.checkScalingIntegrity(payload);

        const scaling = config.instance.scaling,
            oldScaling = _.cloneDeep(scaling);

        _.merge(scaling, payload);

        if (_.isEqual(scaling, oldScaling)) {
            return res.sendStatus(204);
        }
        else {
            manager.emit('scaling:updated', scaling);

            return res.send(scaling);
        }
    }
};
