'use strict';

var _ = require('lodash'),
    express = require('express');


module.exports = createRouter;


////////////

function createRouter(manager) {
    var router = express.Router();

    // Instance
    router.post('/stop', stopInstance);

    // Config
    router.get('/config', getConfig);
    router.patch('/config', updateConfig);


    return router;


    ////////////

    function stopInstance(req, res) {
        var name = req.body['name'];
        if (!name || name.length <= 0) {
            return res.status(500).send('Name not found');
        }

        var promise = manager.stopInstance(name);
        if (!promise) {
            return res.status(404).send('Proxy ' + name + ' not found');
        }

        promise
            .then(function() {
                var payload = {
                    alive: manager.getAliveInstances().length,
                };

                res.status(200).send(payload);
            })
            .catch(function(err) {
                res.status(500).send(err.toString());
            });
    }

    function getConfig(req, res) {
        var config = req.app.get('config');

        var viewConfig = omitDeep(config, ['password', 'test']);

        return res.status(200).send(viewConfig);



    }

    function updateConfig(req, res) {
        var payload = req.body;

        payload = omitDeep(payload, ['password', 'test']);

        var config = req.app.get('config'),
            oldConfig = _.cloneDeep(config);

        config = _.merge(config, payload);

        if (_.isEqual(config, oldConfig)) {
            return res.sendStatus(204);
        }
        else {
            var viewConfig = omitDeep(config, ['password', 'test']);

            return res.status(200).send(viewConfig);
        }
    }

    function omitDeep(obj, keys) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(function(d) { return omitDeep(d, keys); });
        }

        var target = {};

        Object.keys(obj).forEach(function(key) {
            if (keys.indexOf(key) < 0) {
                target[key] = omitDeep(obj[key], keys);
            }
        });

        return target;
    }
}