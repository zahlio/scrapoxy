'use strict';

module.exports = class InstanceModel {
    constructor(name, type, status, address, providerOpts) {
        this.name = name;
        this.type = type;
        this.status = status;
        this.address = address;

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

