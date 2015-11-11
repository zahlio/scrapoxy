'use strict';


module.exports = InstanceModel;


////////////

function InstanceModel(name, type, status, address, providerOpts) {
    this._name = name;
    this._type = type;
    this._status = status;
    this._address = address;

    this._providerOpts = providerOpts;
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

InstanceModel.prototype.getType = function getTypeFn() {
    return this._type;
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


InstanceModel.prototype.getProviderOpts = function getProviderOptsFn() {
    return this._providerOpts;
};


InstanceModel.prototype.getStats = function getStatsFn() {
    return {
        name: this._name,
        type: this._type,
        status: this._status,
        address: this._address,
    };
};


InstanceModel.prototype.toString = function toStringFn() {
    if (this._address) {
        var addressStr = this._address.hostname + ":" + this._address.port;

        return this._name + "@" + addressStr + " / providerOpts=" + this._providerOpts.toString();
    }

    return this._name + " / providerOpts=" + this._providerOpts.toString();
};
