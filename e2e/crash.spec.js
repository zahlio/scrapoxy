'use strict';

const Promise = require('bluebird'),
    expect = require('chai').expect,
    Proxies = require('../server/proxies');

const config = require('./config'),
    provider = require('./provider');


describe('restart crashed instance', function desc() {
    this.timeout(120 * 1000);

    let proxies;

    before(() => {
        proxies = new Proxies(config, provider);

        return proxies.listenAndWait();
    });

    after(() => proxies.shutdown());


    it('should kill an instance', () => {
        const instances = proxies.manager.instances;
        expect(instances).to.have.length(config.instance.scaling.min);

        return proxies.manager.crashRandomInstance();
    });

    it('should restart an instance',
        () => Promise
            .delay(10 * 1000)
            .then(() => {
                const instances = proxies.manager.instances;

                expect(instances).to.have.length(config.instance.scaling.min);
            })
    );
});
