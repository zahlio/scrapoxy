'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    expect = require('chai').expect,
    Proxies = require('../server/proxies'),
    sequential = require('./common/sequential'),
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


describe('test load with proxies', function desc() {
    this.timeout(4 * 60 * 1000);

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

    it('should have enough good requests', (done) => {
        const urls = new Array(7 * 1000);
        _.fill(urls, config.test.mirror);

        const chunks = _.chunk(urls, 50);
        const result = new Array(chunks.length);

        sequential(chunks, result,
            (chunk) => Promise
                .map(chunk,
                (url) => simplerequest
                    .putWithProxy(url, {}, proxy)
                    .then((response) => response.statusCode)
                    .catch(() => 999)
                    .then((status) => status)
            )
            , 50, 0)
            .then(() => {
                const count = _(result)
                    .flatten()
                    .countBy()
                    .value();

                const total = _(count)
                    .values()
                    .sum();

                const countCode = _(count)
                    .pairs()
                    .map((d) => ({
                        code: d[0],
                        count: d[1],
                        rate: Math.round(100.0 * d[1] / total),
                    })
                )
                    .indexBy('code')
                    .value();

                // min 90% of response statuses must be 200
                expect(countCode['200'].rate).to.be.above(90);

                done();
            });
    });
});
