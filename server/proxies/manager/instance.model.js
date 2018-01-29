'use strict';


const
    geoip = require('geoip-lite');


module.exports = class InstanceModel {
    constructor(name, type, status, locked, address, region, providerOpts) {
        this.name = name;
        this.type = type;
        this.status = status;
        this.locked = locked;
        this.region = region;
        this.providerOpts = providerOpts;

        this.address = address;
        if (this.address) {
            const geo = geoip.lookup(this.address.hostname);
            if (geo) {
                this.latlng = geo.ll;
            }
        }
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
            latlng: this.latlng,
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

