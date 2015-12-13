'use strict';

const Promise = require('bluebird'),
    expect = require('chai').expect,
    pinger = require('../server/common/pinger'),
    Proxies = require('../server/proxies'),
    simplerequest = require('./common/simplerequest'),
    TestServer = require('./test-server');

const config = require('./config'),
    provider = require('./provider');

// Proxy config
const proxy = {
    hostname: '127.0.0.1',
    port: config.proxy.port,
    //username: config.proxy.auth.username,
    //password: config.proxy.auth.password,
};

describe('upscale / downscale proxies', function desc() {
    this.timeout(120 * 1000);

    const server = new TestServer();
    let proxies;

    before(() => {
        server.start();

        proxies = new Proxies(config, provider);

        return proxies.listenAndWait();
    });

    after(() => {
        proxies.shutdown();

        server.stop();
    });

    it(`should have ${config.instance.scaling.min} proxies`, () => {
        const instances = proxies.manager.instances;

        expect(instances).to.have.length(config.instance.scaling.min);
    });

    it('should accept 1 request',
        () => simplerequest
            .getWithProxy(config.test.mirror, proxy)
            .then((response) => expect(response.statusCode).to.equal(200))
    );

    it(`should have ${config.instance.scaling.max} proxies`,
        () => Promise
            .delay(5 * 1000)
            .then(() => proxies.manager.instances)
            .map((instance) => pinger.waitPing(
                instance.model.address,
                config.instance.checkDelay,
                10 * 1000))
            .then(
            (items) => expect(items).to.have.length(config.instance.scaling.max)
        )
    );

    it(`should have ${config.instance.scaling.min} proxies`,
        () => Promise
            .delay(30 * 1000)
            .then(() => proxies.manager.instances)
            .map((instance) => pinger.waitPing(
                instance.model.address,
                config.instance.checkDelay,
                10 * 1000))
            .then(
            (items) => expect(items).to.have.length(config.instance.scaling.min)
        )
    );
});
