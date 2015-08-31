'use strict';


module.exports = InstanceModel;


////////////

function InstanceModel(name, status, address, cloudOps) {
    this._name = name;
    this._status = status;
    this._address = address;

    this._cloudOpts = cloudOps;
}


InstanceModel.STOPPED = 'stopped';
InstanceModel.STARTING = 'starting';
InstanceModel.STARTED = 'started';
InstanceModel.STOPPING = 'stopping';
InstanceModel.REMOVED = 'removed';
InstanceModel.ERROR = 'error';


InstanceModel.prototype.getName = function getNameFn() {
    return this._name;
};


InstanceModel.prototype.getStatus = function getStatusFn() {
    return this._status;
};

InstanceModel.prototype.setStatus = function setStatusFn(status) {
    this._status = status;
};

InstanceModel.prototype.hasStatus = function hasStatusFn(status) {
    return this._status === status;
};


InstanceModel.prototype.getAddress = function getAddressFn() {
    return this._address;
};

InstanceModel.prototype.setAddress = function setAddressFn(address) {
    this._address = address;
};


InstanceModel.prototype.getCloudOpts = function getCloudOptsFn() {
    return this._cloudOpts;
};


InstanceModel.prototype.getStats = function getStatsFn() {
    return {
        name: this._name,
        status: this._status,
        address: this._address,
    };
};


InstanceModel.prototype.toString = function toStringFn() {
    if (this._address) {
        var addressStr = this._address.hostname + ":" + this._address.port;

        return this._name + "@" + addressStr + " / cloudOps=" + this._cloudOpts.toString();
    }

    return this._name + " / cloudOps=" + this._cloudOpts.toString();
};
