'use strict';

const expect = require('chai').expect,
    Proxies = require('../server/proxies'),
    simplerequest = require('./common/simplerequest'),
    TestServer = require('./test-server');

const config = require('./config'),
    provider = require('./provider');


config.instance.scaling.min = 2;
config.instance.scaling.max = 2;


// Proxy config
const proxy = {
    hostname: '127.0.0.1',
    port: config.proxy.port,
    //username: config.proxy.auth.username,
    //password: config.proxy.auth.password,
};


describe('send requests with round-robin', function desc() {
    this.timeout(90 * 1000);

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


    const knownProxies = [];
    const knownAgents = [];

    // These requests are sent to a new proxy
    for (let i = 0; i < config.instance.scaling.min; ++i) {
        it(`should request on unknown proxy ${i}`,
            () => simplerequest
                .getWithProxy(config.test.mirror, proxy)
                .then((response) => {
                    expect(response.statusCode).to.equal(200);

                    // Check name of the proxy
                    const name = response.json['x-cache-proxyname'] || response.json['remote-address'];
                    /*eslint no-unused-expressions: 0*/
                    expect(name).to.not.be.empty;

                    if (knownProxies.indexOf(name) >= 0) {
                        throw new Error('request does not swap');
                    }
                    knownProxies.push(name);

                    // Check useragent
                    const useragent = response.json['user-agent'];

                    if (knownAgents.indexOf(useragent) >= 0) {
                        throw new Error('useragent does not swap');
                    }

                    knownAgents.push(useragent);
                })
        );
    }

    // This request is sent to a known proxy
    it('should request on known proxy',
        () => simplerequest
            .getWithProxy(config.test.mirror, proxy)
            .then((response) => {
                expect(response.statusCode).to.equal(200);

                // Check name of the proxy
                const name = response.json['x-cache-proxyname'] || response.json['remote-address'];
                /*eslint no-unused-expressions: 0*/
                expect(name).to.not.be.empty;

                if (knownProxies.indexOf(name) < 0) {
                    throw new Error('request sent to a unknown proxy');
                }

                // Don't check useragent here => not needed
            })
    );
});
