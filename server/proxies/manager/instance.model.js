'use strict';

module.exports = class InstanceModel {
    constructor(name, type, status, locked, address, region, providerOpts) {
        this.name = name;
        this.type = type;
        this.status = status;
        this.locked = locked;
        this.address = address;
        this.region = region;

        this.providerOpts = providerOpts;
    }


    static get STOPPED() {
        return 'stopped';
    }

    static get STARTING() {
        return 'starting';
    }

    static get STARTED() {
        return 'started';
    }

    static get STOPPING() {
        return 'stopping';
    }

    static get REMOVED() {
        return 'removed';
    }

    static get ERROR() {
        return 'error';
    }


    get stats() {
        return {
            name: this.name,
            type: this.type,
            status: this.status,
            address: this.address,
            region: this.region,
        };
    }


    toString() {
        if (this.address) {
            const addressStr = `${this.address.hostname}:${this.address.port}`;

            return `${this.name}@${addressStr}`;
        }

        return `${this.name}`;
    }
};

