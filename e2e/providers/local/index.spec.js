'use strict';

const Promise = require('bluebird'),
    expect = require('chai').expect,
    pinger = require('../../../server/common/pinger');

const ProviderLocal = require('./index');


describe('ProviderLocal', function desc() {
    this.timeout(10 * 1000);


    let provider;
    before(
        () => provider = new ProviderLocal()
    );


    describe('start/stop', () => {
        let models;

        it('should start',
            () => provider
                .createInstances(2)
                .delay(2000)
                .then(() => provider.models)
                .then((mds) => {
                    expect(mds).to.have.length(2);

                    models = mds;
                })
        );

        it('should be alive (ping)',
            () => Promise
                .map(models,
                (model) => pinger.pingRetry(model.address, 2, 2000)
            )
        );

        it('should shutdown',
            () => provider
                .removeInstances(models)
                .delay(2000)
        );

        it('should be dead (ping)', (done) => {
            Promise.map(models,
                (model) => pinger.pingRetry(model.address, 2, 500)
            )
                .then(() => done(new Error('Ping should not work!')))
                .catch(() => done());
        });
    });


    describe('change address', () => {
        let model;

        it('should start',
            () => provider
                .createInstances(1)
                .delay(2000)
                .then(() => provider.models)
                .then((mds) => {
                    expect(mds).to.have.length(1);

                    model = mds[0];

                    return pinger.pingRetry(model.address, 2, 2000);
                })
        );

        it('should restart',
            () => provider
                .removeInstance(model)
                .delay(2000)
                .then(() => provider.startInstance(model))
                .delay(2000)
                .tap(() => pinger.pingRetry(model.address, 2, 2000))
                .then(() => provider.removeInstances([model]))
        );
    });
});
