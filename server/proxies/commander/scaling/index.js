'use strict';

var _ = require('lodash'),
    express = require('express'),
    tools = require('../tools');


module.exports = createRouter;


////////////

function createRouter(manager) {
    var router = express.Router();

    router.get('/', getScaling);
    router.patch('/', updateScaling);

    return router;


    ////////////

    function getScaling(req, res) {
        var config = req.app.get('config'),
            scaling = config.instance.scaling;

        return res.status(200).send(scaling);
    }

    function updateScaling(req, res) {
        var payload = req.body;

        tools.checkScalingIntegrity(payload);

        var config = req.app.get('config'),
            scaling = config.instance.scaling,
            oldScaling = _.cloneDeep(scaling);

        scaling = _.merge(scaling, payload);

        if (_.isEqual(scaling, oldScaling)) {
            return res.sendStatus(204);
        }
        else {
            manager.emit('scaling:updated', scaling);

            return res.status(200).send(scaling);
        }
    }
}