/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _home = __webpack_require__(1);

	var _home2 = _interopRequireDefault(_home);

	var _login = __webpack_require__(16);

	var _login2 = _interopRequireDefault(_login);

	var _indexConfig = __webpack_require__(22);

	var _indexConfig2 = _interopRequireDefault(_indexConfig);

	var _indexConfig3 = __webpack_require__(23);

	var _indexConfig4 = _interopRequireDefault(_indexConfig3);

	var _indexConfig5 = __webpack_require__(24);

	var _indexConfig6 = _interopRequireDefault(_indexConfig5);

	var _events = __webpack_require__(25);

	var _events2 = _interopRequireDefault(_events);

	var _icons = __webpack_require__(26);

	var _icons2 = _interopRequireDefault(_icons);

	var _instances = __webpack_require__(27);

	var _instances2 = _interopRequireDefault(_instances);

	var _cache = __webpack_require__(28);

	var _cache2 = _interopRequireDefault(_cache);

	var _scaling = __webpack_require__(29);

	var _scaling2 = _interopRequireDefault(_scaling);

	var _cache3 = __webpack_require__(30);

	var _cache4 = _interopRequireDefault(_cache3);

	var _stats = __webpack_require__(31);

	var _stats2 = _interopRequireDefault(_stats);

	var _toast = __webpack_require__(32);

	var _toast2 = _interopRequireDefault(_toast);

	var _address = __webpack_require__(33);

	var _address2 = _interopRequireDefault(_address);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = angular.module('myApp', ['restangular', 'ngMessages', 'ui.router', 'ui.bootstrap', _home2.default.name, _login2.default.name]);

	/*
	 * Configuration
	 */


	app.config(_indexConfig2.default).config(_indexConfig4.default).config(_indexConfig6.default);

	/*
	 * Common
	 */


	app.service('EventsService', _events2.default).service('IconsService', _icons2.default).service('InstancesService', _instances2.default).service('InstancesCacheService', _cache2.default).service('ScalingService', _scaling2.default).service('ScalingCacheService', _cache4.default).service('StatsService', _stats2.default).service('ToastService', _toast2.default);

	/*
	 * Filters
	 */


	app.filter('address', _address2.default);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _instances = __webpack_require__(2);

	var _instances2 = _interopRequireDefault(_instances);

	var _stats = __webpack_require__(8);

	var _stats2 = _interopRequireDefault(_stats);

	var _home = __webpack_require__(13);

	var _home2 = _interopRequireDefault(_home);

	var _navbar = __webpack_require__(15);

	var _navbar2 = _interopRequireDefault(_navbar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = angular.module('myApp.home', ['ui.router', _instances2.default.name, _stats2.default.name]);

	/*
	 * Route
	 */


	app.config(_home2.default);

	/*
	 * Directives
	 */


	app.directive('navbar', _navbar2.default);

	exports.default = app;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _instances = __webpack_require__(3);

	var _instances2 = _interopRequireDefault(_instances);

	var _instance = __webpack_require__(6);

	var _instance2 = _interopRequireDefault(_instance);

	var _scaling = __webpack_require__(7);

	var _scaling2 = _interopRequireDefault(_scaling);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = angular.module('myApp.home.instances', ['ui.router']);

	/*
	 * Route
	 */


	app.config(_instances2.default);

	/*
	 * Directives
	 */


	app.directive('instance', _instance2.default).directive('scalingValidator', _scaling2.default);

	exports.default = app;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	route.$inject = ["$stateProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = route;

	var _instancesController = __webpack_require__(4);

	var _instancesController2 = _interopRequireDefault(_instancesController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function route($stateProvider) {
	    'ngInject';

	    $stateProvider.state('home.instances', {
	        url: '/instances',
	        templateUrl: 'app/home/instances/instances.html',
	        controller: _instancesController2.default,
	        controllerAs: 'vm'
	    });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _scaling = __webpack_require__(5);

	var _scaling2 = _interopRequireDefault(_scaling);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Controller = function () {
	    Controller.$inject = ["$log", "$uibModal", "InstancesCacheService", "ScalingCacheService", "ToastService"];
	    function Controller($log, $uibModal, InstancesCacheService, ScalingCacheService, ToastService) {
	        'ngInject';

	        var _this = this;

	        _classCallCheck(this, Controller);

	        this.$log = $log;
	        this.$uibModal = $uibModal;
	        this.InstancesCacheService = InstancesCacheService;
	        this.ScalingCacheService = ScalingCacheService;
	        this.ToastService = ToastService;

	        this.instances = [];

	        this.scaling = {
	            min: 0,
	            required: 0,
	            max: 0
	        };

	        this.InstancesCacheService.getAllInstances().then(function (instances) {
	            _this.instances = instances;
	        }).catch(function (err) {
	            _this.$log.error(err);
	            _this.ToastService.error('Cannot load instances');
	        });

	        this.ScalingCacheService.getScaling().then(function (scaling) {
	            _this.scaling = scaling;
	        }).catch(function (err) {
	            _this.$log.error(err);
	            _this.ToastService.error('Cannot load scaling');
	        });
	    }

	    _createClass(Controller, [{
	        key: 'openScalingModal',
	        value: function openScalingModal() {
	            var _this2 = this;

	            var modalInstance = this.$uibModal.open({
	                templateUrl: 'app/home/instances/scaling/scaling.html',
	                controller: _scaling2.default,
	                controllerAs: 'vm',
	                animation: false,
	                resolve: {
	                    scaling: function scaling() {
	                        return _.cloneDeep(_this2.scaling);
	                    }
	                }
	            });

	            modalInstance.result.then(function (scaling) {
	                return _this2.ScalingCacheService.updateScaling(scaling).catch(function (err) {
	                    _this2.$log.error(err);
	                    _this2.ToastService.error('Cannot update scaling: ' + err);
	                });
	            });
	        }
	    }, {
	        key: 'scaleMin',
	        value: function scaleMin() {
	            var _this3 = this;

	            var scaling = _.cloneDeep(this.scaling);
	            scaling.required = scaling.min;

	            this.ScalingCacheService.updateScaling(scaling).catch(function (err) {
	                _this3.$log.error(err);
	                _this3.ToastService.error('Cannot update scaling: ' + err);
	            });
	        }
	    }, {
	        key: 'scaleMax',
	        value: function scaleMax() {
	            var _this4 = this;

	            var scaling = _.cloneDeep(this.scaling);
	            scaling.required = scaling.max;

	            this.ScalingCacheService.updateScaling(scaling).catch(function (err) {
	                _this4.$log.error(err);
	                _this4.ToastService.error('Cannot update scaling: ' + err);
	            });
	        }
	    }]);

	    return Controller;
	}();

	exports.default = Controller;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Controller = function () {
	    Controller.$inject = ["$uibModalInstance", "scaling"];
	    function Controller($uibModalInstance, scaling) {
	        'ngInject';

	        _classCallCheck(this, Controller);

	        this.$uibModalInstance = $uibModalInstance;
	        this.scaling = scaling;
	    }

	    _createClass(Controller, [{
	        key: 'ok',
	        value: function ok() {
	            this.$uibModalInstance.close(this.scaling);
	        }
	    }, {
	        key: 'cancel',
	        value: function cancel() {
	            this.$uibModalInstance.dismiss('cancel');
	        }
	    }]);

	    return Controller;
	}();

	exports.default = Controller;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = Directive;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function Directive() {
	    'ngInject';

	    var directive = {
	        restrict: 'E',
	        templateUrl: 'app/home/instances/instance/instance.html',
	        scope: {},
	        controller: Controller,
	        controllerAs: 'vm',
	        bindToController: {
	            container: '='
	        }
	    };

	    return directive;
	}

	////////////

	var Controller = function () {
	    Controller.$inject = ["IconsService", "InstancesCacheService", "ToastService"];
	    function Controller(IconsService, InstancesCacheService, ToastService) {
	        'ngInject';

	        _classCallCheck(this, Controller);

	        this.InstancesCacheService = InstancesCacheService;
	        this.IconsService = IconsService;
	        this.ToastService = ToastService;
	    }

	    _createClass(Controller, [{
	        key: 'kill',
	        value: function kill() {
	            var _this = this;

	            this.InstancesCacheService.deleteInstance(this.container.content.name).then(function () {
	                _this.ToastService.success('Remove ' + _this.container.content.name + ' asked.');
	            }).catch(function (err) {
	                _this.ToastService.error(err.data);
	            });
	        }
	    }]);

	    return Controller;
	}();

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Directive;
	function Directive() {
	    'ngInject';

	    var directive = {
	        restrict: 'A',
	        require: 'ngModel',
	        scope: {
	            scmin: '=',
	            scmax: '='
	        },
	        link: linkFunc
	    };

	    return directive;

	    ////////////

	    function linkFunc($scope, element, attrs, ngModel) {
	        ngModel.$validators.scmin = function (modelValue) {
	            return modelValue >= $scope.scmin;
	        };
	        ngModel.$validators.scmax = function (modelValue) {
	            return modelValue <= $scope.scmax;
	        };

	        $scope.$watch('scmin', function () {
	            return ngModel.$validate();
	        });

	        $scope.$watch('scmax', function () {
	            return ngModel.$validate();
	        });
	    }
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _stats = __webpack_require__(9);

	var _stats2 = _interopRequireDefault(_stats);

	var _timechart = __webpack_require__(12);

	var _timechart2 = _interopRequireDefault(_timechart);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = angular.module('myApp.home.stats', ['ui.router']);

	/*
	 * Route
	 */


	app.config(_stats2.default);

	/*
	 * Directives
	 */


	app.directive('timechart', _timechart2.default);

	exports.default = app;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	route.$inject = ["$stateProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = route;

	var _statsController = __webpack_require__(10);

	var _statsController2 = _interopRequireDefault(_statsController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function route($stateProvider) {
	    'ngInject';

	    $stateProvider.state('home.stats', {
	        url: '/stats',
	        templateUrl: 'app/home/stats/stats.html',
	        controller: _statsController2.default,
	        controllerAs: 'vm'
	    });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _timeWindow = __webpack_require__(11);

	var _timeWindow2 = _interopRequireDefault(_timeWindow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Controller = function Controller($rootScope, $scope, StatsService) {
	    'ngInject';

	    _classCallCheck(this, Controller);

	    var self = this;

	    // Global
	    self.global = {};

	    // Default scaling
	    self.scale = 60000;

	    $scope.$watch('vm.scale', function (newScale) {
	        return loadScale(newScale);
	    });

	    // Charts
	    self.requests = {
	        columns: {
	            label1: 'Requests count',
	            label2: 'Requests delay (in seconds)'
	        },
	        data: new _timeWindow2.default(self.scale, 60, false, true)
	    };

	    self.flow = {
	        columns: {
	            label1: 'KB received',
	            label2: 'KB sent'
	        },
	        data: new _timeWindow2.default(self.scale, 60, false, false)
	    };

	    self.stop_order_count = {
	        columns: {
	            label1: 'Now',
	            label2: 'Cumulated'
	        },
	        data: new _timeWindow2.default(self.scale, 60, true, true)
	    };

	    // Live stats
	    var unwatch = $rootScope.$on('stats', function (ev, d) {
	        return addData(d);
	    });
	    $scope.$on('$destroy', unwatch);

	    ////////////

	    function loadScale(scale) {
	        StatsService.getAll(scale).then(function (data) {
	            self.requests.data.clear(scale);
	            self.flow.data.clear(scale);
	            self.stop_order_count.data.clear(scale);

	            data.forEach(addData);
	        });
	    }

	    function addData(data) {
	        if (self.requests.data) {
	            self.requests.data.add({
	                ts: data.ts,
	                label1: data.rq.count,
	                label2: data.rq.duration
	            });
	        }

	        if (self.flow.data) {
	            self.flow.data.add({
	                ts: data.ts,
	                label1: b2kb(data.flow.bytes_received),
	                label2: b2kb(data.flow.bytes_sent)
	            });
	        }

	        if (self.stop_order_count.data) {
	            self.stop_order_count.data.add({
	                ts: data.ts,
	                label1: data.stop_order_count.now,
	                label2: data.stop_order_count.total
	            });

	            data.global.stop_order_count = data.stop_order_count.total;
	        }

	        data.global.kbytes_received = b2kb(data.global.bytes_received);
	        delete data.global.bytes_received;

	        data.global.kbytes_sent = b2kb(data.global.bytes_sent);
	        delete data.global.bytes_received;

	        _.merge(self.global, data.global);

	        ////////////

	        function b2kb(v) {
	            return Math.floor(v / 1024);
	        }
	    }
	};
	Controller.$inject = ["$rootScope", "$scope", "StatsService"];

	exports.default = Controller;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TimeWindow = function () {
	    function TimeWindow(retention, maxTick, avg1, avg2) {
	        _classCallCheck(this, TimeWindow);

	        this._retention = retention;
	        this._maxTick = maxTick;
	        this._samplingTick = Math.floor(this._retention / this._maxTick / 1000);
	        this._avg1 = avg1;
	        this._avg2 = avg2;

	        this._buffer = void 0;
	        this._bufferCount = 0;

	        this._items = [];
	    }

	    _createClass(TimeWindow, [{
	        key: "add",
	        value: function add(item) {
	            if (!item) {
	                return;
	            }

	            if (!item.ts) {
	                item.ts = new Date().getTime();
	            }

	            if (!this._buffer) {
	                this._buffer = item;
	                this._bufferCount = 1;
	            } else if (this._bufferCount < this._samplingTick) {
	                this._buffer.label1 += item.label1;
	                this._buffer.label2 += item.label2;

	                ++this._bufferCount;
	            } else {
	                if (this._avg1) {
	                    this._buffer.label1 /= this._bufferCount;
	                }

	                if (this._avg2) {
	                    this._buffer.label2 /= this._bufferCount;
	                }

	                this._items.push({
	                    ts: this._buffer.ts,
	                    label1: this._buffer.label1,
	                    label2: this._buffer.label2
	                });

	                this._buffer = item;
	                this._bufferCount = 1;
	            }

	            this._refresh();
	        }
	    }, {
	        key: "getItems",
	        value: function getItems() {
	            this._refresh();

	            return this._items;
	        }
	    }, {
	        key: "clear",
	        value: function clear(retention) {
	            this._retention = retention;
	            this._samplingTick = Math.floor(this._retention / this._maxTick / 1000);

	            this._buffer = void 0;
	            this._bufferCount = 0;

	            this._items.length = 0;
	        }
	    }, {
	        key: "_refresh",
	        value: function _refresh() {
	            var limit = new Date().getTime() - this._retention;

	            this._items = _.filter(this._items, function (item) {
	                return item.ts > limit;
	            });
	        }
	    }]);

	    return TimeWindow;
	}();

	exports.default = TimeWindow;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Directive;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function Directive() {
	    'ngInject';

	    var directive = {
	        restrict: 'E',
	        scope: {},
	        controller: Controller,
	        controllerAs: 'vm',
	        bindToController: {
	            columns: '=',
	            data: '='
	        },
	        link: linkFunc
	    };

	    return directive;

	    ////////////

	    function linkFunc($scope, element, attrs, ctrl) {
	        element.css('display', 'block');

	        var chart = c3.generate({
	            bindto: element[0],
	            data: {
	                x: 'x',
	                columns: [['x'], [ctrl.columns.label1], [ctrl.columns.label2]],
	                axes: {
	                    data2: 'y2'
	                }
	            },
	            axis: {
	                x: {
	                    type: 'timeseries',
	                    tick: {
	                        format: '%H:%M:%S'
	                    }
	                },
	                y: {
	                    label: {
	                        text: ctrl.label1,
	                        position: 'outer-middle'
	                    }
	                },
	                y2: {
	                    show: true,
	                    label: {
	                        text: ctrl.label2,
	                        position: 'outer-middle'
	                    }
	                }
	            },
	            transition: {
	                duration: 0
	            }
	        });

	        $scope.$watchCollection(function () {
	            return ctrl.data.getItems();
	        }, buildColumns);

	        ////////////

	        function buildColumns(data) {
	            if (!data || data.length <= 0) {
	                chart.unload({
	                    ids: ['x', ctrl.columns.label1, ctrl.columns.label2]
	                });
	            } else {
	                (function () {
	                    var columns = [['x'], [ctrl.columns.label1], [ctrl.columns.label2]];

	                    data.forEach(function (d) {
	                        columns[0].push(moment(d.ts).toDate());

	                        columns[1].push(d.label1);
	                        columns[2].push(d.label2);
	                    });

	                    chart.load({
	                        columns: columns
	                    });
	                })();
	            }
	        }
	    }
	}

	////////////

	var Controller = function Controller() {
	    'ngInject';

	    _classCallCheck(this, Controller);
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	route.$inject = ["$stateProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = route;

	var _homeController = __webpack_require__(14);

	var _homeController2 = _interopRequireDefault(_homeController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function route($stateProvider) {
	    'ngInject';

	    $stateProvider.state('home', {
	        abstract: true,
	        data: {
	            requiredAuth: true
	        },
	        url: '/home',
	        templateUrl: 'app/home/home.html',
	        controller: _homeController2.default,
	        controllerAs: 'vm'
	    });
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Controller = function Controller($log, $scope, EventsService, InstancesCacheService, AuthService, ScalingCacheService, ToastService) {
	    'ngInject';

	    _classCallCheck(this, Controller);

	    $scope.$on('$destroy', function () {
	        InstancesCacheService.stop();
	        ScalingCacheService.stop();

	        EventsService.stop();
	    });

	    EventsService.start(AuthService.getToken()).then(function () {
	        return ToastService.success('GUI is connected.');
	    }).catch(function (err) {
	        $log.error(err);

	        ToastService.error('Cannot connect to daemon.<br/>Please reload GUI.');
	    });

	    // Cache data
	    ScalingCacheService.getScaling();
	    InstancesCacheService.getAllInstances();
	};
	Controller.$inject = ["$log", "$scope", "EventsService", "InstancesCacheService", "AuthService", "ScalingCacheService", "ToastService"];

	exports.default = Controller;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = Directive;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function Directive() {
	    'ngInject';

	    var directive = {
	        restrict: 'E',
	        templateUrl: 'app/home/navbar/navbar.html',
	        scope: {},
	        controller: Controller,
	        controllerAs: 'vm',
	        bindToController: {}
	    };

	    return directive;
	}

	////////////

	var Controller = function () {
	    Controller.$inject = ["$state", "AuthService"];
	    function Controller($state, AuthService) {
	        'ngInject';

	        _classCallCheck(this, Controller);

	        this.$state = $state;
	        this.AuthService = AuthService;
	    }

	    _createClass(Controller, [{
	        key: 'logout',
	        value: function logout() {
	            var _this = this;

	            this.AuthService.logout().then(function () {
	                return _this.$state.go('login');
	            });
	        }
	    }]);

	    return Controller;
	}();

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _token = __webpack_require__(17);

	var _token2 = _interopRequireDefault(_token);

	var _token3 = __webpack_require__(18);

	var _token4 = _interopRequireDefault(_token3);

	var _login = __webpack_require__(19);

	var _login2 = _interopRequireDefault(_login);

	var _auth = __webpack_require__(21);

	var _auth2 = _interopRequireDefault(_auth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = angular.module('myApp.login', ['ui.router']);

	/*
	 * Configuration
	 */


	app.config(_token2.default).run(_token4.default);

	/*
	 * Route
	 */


	app.config(_login2.default);

	/*
	 * Service
	 */

	app.service('AuthService', _auth2.default);

	exports.default = app;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	config.$inject = ["$httpProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = config;
	function config($httpProvider) {
	    'ngInject';

	    interceptor.$inject = ["$injector", "$q"];
	    $httpProvider.interceptors.push(interceptor);

	    ////////////

	    function interceptor($injector, $q) {
	        'ngInject';

	        var intcp = {
	            request: request,
	            responseError: responseError
	        };

	        return intcp;

	        ////////////

	        function request(cfg) {
	            var AuthService = $injector.get('AuthService'),
	                token = AuthService.getToken();

	            if (token) {
	                cfg.headers.Authorization = token;
	            }

	            return cfg;
	        }

	        function responseError(rejection) {
	            if (rejection.status === 401 || rejection.status === 403) {
	                (function () {
	                    var AuthService = $injector.get('AuthService'),
	                        $state = $injector.get('$state');

	                    // Force logout and redirect to login page
	                    AuthService.logout().finally(function () {
	                        return $state.go('login');
	                    });
	                })();
	            }

	            return $q.reject(rejection);
	        }
	    }
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	config.$inject = ["$state", "$rootScope", "AuthService"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = config;
	function config($state, $rootScope, AuthService) {
	    'ngInject';

	    /*eslint angular/on-watch: 0*/

	    $rootScope.$on('$stateChangeStart', function (event, toState) {
	        if (toState.name === 'login') {
	            return;
	        }

	        var requireAuth = toState.data.requireAuth;
	        if (!requireAuth) {
	            return;
	        }

	        var token = AuthService.getToken();
	        if (token) {
	            return;
	        }

	        event.preventDefault();

	        $state.go('login');
	    });
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	route.$inject = ["$stateProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = route;

	var _loginController = __webpack_require__(20);

	var _loginController2 = _interopRequireDefault(_loginController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function route($stateProvider) {
	    'ngInject';

	    $stateProvider.state('login', {
	        data: {
	            requiredAuth: false
	        },
	        url: '/login',
	        templateUrl: 'app/login/login.html',
	        controller: _loginController2.default,
	        controllerAs: 'vm'
	    });
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Controller = function () {
	    Controller.$inject = ["$state", "AuthService", "ToastService"];
	    function Controller($state, AuthService, ToastService) {
	        'ngInject';

	        _classCallCheck(this, Controller);

	        this.$state = $state;
	        this.AuthService = AuthService;
	        this.ToastService = ToastService;

	        // Credentials
	        this.password = '';
	    }

	    _createClass(Controller, [{
	        key: 'login',
	        value: function login() {
	            var _this = this;

	            this.AuthService.login(this.password).then(function () {
	                return _this.$state.go('home.instances');
	            }).catch(function () {
	                return _this.ToastService.error('Invalid password');
	            });
	        }
	    }]);

	    return Controller;
	}();

	exports.default = Controller;

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    Service.$inject = ["$q"];
	    function Service($q) {
	        'ngInject';

	        _classCallCheck(this, Service);

	        this.$q = $q;
	    }

	    _createClass(Service, [{
	        key: 'login',
	        value: function login(password) {
	            return this.$q(function (resolve, reject) {
	                if (!password || password.length <= 0) {
	                    return reject('Password is empty');
	                }

	                var hash = btoa(password);

	                localStorage.setItem('token', hash);

	                resolve();
	            });
	        }
	    }, {
	        key: 'getToken',
	        value: function getToken() {
	            try {
	                return localStorage.getItem('token');
	            } catch (err) {
	                return;
	            }
	        }
	    }, {
	        key: 'logout',
	        value: function logout() {
	            try {
	                localStorage.removeItem('token');
	            } catch (err) {
	                // Ignore
	            } finally {
	                return this.$q.resolve();
	            }
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	config.$inject = ["$logProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = config;
	function config($logProvider) {
	    'ngInject';

	    // Enable log

	    $logProvider.debugEnabled(false);
	}

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	config.$inject = ["$urlRouterProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = config;
	function config($urlRouterProvider) {
	    'ngInject';

	    // Default route

	    $urlRouterProvider.otherwise(function ($injector) {
	        var $state = $injector.get('$state');

	        $state.go('home.instances');
	    });
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	config.$inject = ["RestangularProvider"];
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = config;
	function config(RestangularProvider) {
	    'ngInject';

	    RestangularProvider.setBaseUrl('/api');
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    Service.$inject = ["$q", "$log", "$rootScope"];
	    function Service($q, $log, $rootScope) {
	        'ngInject';

	        _classCallCheck(this, Service);

	        this.$q = $q;
	        this.$log = $log;
	        this.$rootScope = $rootScope;
	    }

	    _createClass(Service, [{
	        key: 'start',
	        value: function start(token) {
	            var _this = this;

	            this.$log.debug('[EventService] start');

	            return this.$q(function (resolve, reject) {
	                if (!window.io) {
	                    return reject(new Error('Cannot find socket.io'));
	                }

	                try {
	                    _this._socket = window.io.connect('', {
	                        path: '/socket.io',
	                        query: 'token=' + encodeURIComponent(token),
	                        'force new connection': true
	                    });

	                    _this._socket.on('event', function (data) {
	                        data = angular.fromJson(data);

	                        _this.$log.debug("[EventService] event '%s': ", data.event, data.payload);

	                        _this.$rootScope.$apply(function () {
	                            return _this.$rootScope.$emit(data.event, data.payload);
	                        });
	                    });

	                    resolve();
	                } catch (err) {
	                    reject(err);
	                }
	            });
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            this.$log.debug('[EventService] stop');

	            this._socket.disconnect();
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    function Service() {
	        'ngInject';

	        _classCallCheck(this, Service);
	    }

	    _createClass(Service, [{
	        key: 'getStatus',
	        value: function getStatus(status) {
	            switch (status) {
	                case 'started':
	                    {
	                        return 'icon-started';
	                    }

	                case 'stopped':
	                    {
	                        return 'icon-stopped';
	                    }

	                case 'starting':
	                    {
	                        return 'icon-starting';
	                    }

	                case 'stopping':
	                    {
	                        return 'icon-stopping';
	                    }

	                default:
	                    {
	                        return 'icon-unknown';
	                    }
	            }
	        }
	    }, {
	        key: 'isAlive',
	        value: function isAlive(alive) {
	            if (alive) {
	                return 'icon-alive';
	            } else {
	                return 'icon-dead';
	            }
	        }
	    }, {
	        key: 'getProviderType',
	        value: function getProviderType(type) {
	            switch (type) {
	                case 'awsec2':
	                    {
	                        return 'icon-awsec2';
	                    }

	                case 'digitalocean':
	                    {
	                        return 'icon-digitalocean';
	                    }

	                case 'ovhcloud':
	                    {
	                        return 'icon-ovhcloud';
	                    }

	                case 'vscale':
	                    {
	                        return 'icon-vscale';
	                    }

	                default:
	                    {
	                        return 'icon-unknown';
	                    }
	            }
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    Service.$inject = ["Restangular"];
	    function Service(Restangular) {
	        'ngInject';

	        _classCallCheck(this, Service);

	        this.BASE = Restangular.all('instances');
	    }

	    _createClass(Service, [{
	        key: 'getAllInstances',
	        value: function getAllInstances() {
	            return this.BASE.getList();
	        }
	    }, {
	        key: 'deleteInstance',
	        value: function deleteInstance(name) {
	            var payload = { name: name };

	            return this.BASE.all('stop').post(payload);
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    Service.$inject = ["$q", "$log", "$rootScope", "IconsService", "InstancesService", "ToastService"];
	    function Service($q, $log, $rootScope, IconsService, InstancesService, ToastService) {
	        'ngInject';

	        _classCallCheck(this, Service);

	        this.$q = $q;
	        this.$log = $log;
	        this.$rootScope = $rootScope;
	        this.IconsService = IconsService;
	        this.InstancesService = InstancesService;
	        this.ToastService = ToastService;

	        this._instances = void 0;
	        this._instancesPromise = void 0;

	        this._unwatchStatusUpdated = void 0;
	        this._unwatchAliveUpdated = void 0;
	    }

	    _createClass(Service, [{
	        key: 'getAllInstances',
	        value: function getAllInstances() {
	            var self = this;

	            if (self._instances) {
	                return self.$q.when(self._instances);
	            }

	            if (self._instancesPromise) {
	                return self._instancesPromise;
	            }

	            self._instancesPromise = self.InstancesService.getAllInstances().then(function (newInstances) {
	                self._instances = newInstances.map(function (d) {
	                    return { content: d };
	                });

	                self._unwatchStatusUpdated = self.$rootScope.$on('status:updated', instanceUpdated);
	                self._unwatchAliveUpdated = self.$rootScope.$on('alive:updated', instanceUpdated);

	                return self._instances;
	            });

	            ////////////

	            function instanceUpdated(ev, instance) {
	                var idx = _.findIndex(self._instances, { content: { name: instance.name } });
	                if (idx >= 0) {
	                    if (instance.status === 'removed') {
	                        self._instances.splice(idx, 1);

	                        self.ToastService.success('Instance ' + instance.name + ' removed.');
	                    } else {
	                        var msg = getMessage(self._instances[idx].content, instance);

	                        self._instances[idx].content = instance;

	                        if (msg) {
	                            self.ToastService.success(msg);
	                        }
	                    }
	                } else if (instance.status !== 'removed') {
	                    var container = {
	                        content: instance
	                    };

	                    self._instances.push(container);

	                    self.ToastService.success('Instance ' + instance.name + ' created.');
	                } else {
	                    self.$log.error('Unknown instance ' + instance.name + ' removed.');
	                }

	                ////////////

	                function getMessage(oldInstance, newInstance) {
	                    var msgs = ['Instance ' + newInstance.name + ' updated.'];

	                    if (oldInstance.status !== newInstance.status) {
	                        msgs.push('<i class="icon ' + self.IconsService.getStatus(oldInstance.status) + '"></i>\n                        to\n                        <i class="icon ' + self.IconsService.getStatus(newInstance.status) + '"></i>');
	                    }

	                    if (oldInstance.alive !== newInstance.alive) {
	                        msgs.push('<i class="icon ' + self.IconsService.isAlive(oldInstance.alive) + '"></i>\n                        to\n                        <i class="icon ' + self.IconsService.isAlive(newInstance.alive) + '"></i>');
	                    }

	                    return msgs.join('<br/>\n');
	                }
	            }
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            if (this._unwatchStatusUpdated) {
	                this._unwatchStatusUpdated();
	                this._unwatchStatusUpdated = void 0;
	            }

	            if (this._unwatchAliveUpdated) {
	                this._unwatchAliveUpdated();
	                this._unwatchAliveUpdated = void 0;
	            }

	            this._instances = void 0;
	            this._instancesPromise = void 0;
	        }
	    }, {
	        key: 'deleteInstance',
	        value: function deleteInstance(name) {
	            return this.InstancesService.deleteInstance(name);
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    Service.$inject = ["Restangular"];
	    function Service(Restangular) {
	        'ngInject';

	        _classCallCheck(this, Service);

	        this.BASE = Restangular.one('scaling');
	    }

	    _createClass(Service, [{
	        key: 'getScaling',
	        value: function getScaling() {
	            return this.BASE.get().then(function (data) {
	                return data.plain();
	            });
	        }
	    }, {
	        key: 'updateScaling',
	        value: function updateScaling(newScaling) {
	            return this.BASE.patch(newScaling).then(function (data) {
	                if (!data) {
	                    return newScaling;
	                }

	                return data.plain();
	            });
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    Service.$inject = ["$q", "$log", "$rootScope", "ScalingService", "ToastService"];
	    function Service($q, $log, $rootScope, ScalingService, ToastService) {
	        'ngInject';

	        _classCallCheck(this, Service);

	        this.$q = $q;
	        this.$log = $log;
	        this.$rootScope = $rootScope;
	        this.ScalingService = ScalingService;
	        this.ToastService = ToastService;

	        this._scaling = void 0;
	        this._scalingPromise = void 0;

	        this._unwatchScalingUpdated = void 0;
	        this._unwatchScalingError = void 0;
	    }

	    _createClass(Service, [{
	        key: 'getScaling',
	        value: function getScaling() {
	            var _this = this;

	            if (this._scaling) {
	                return this.$q.when(this._scaling);
	            }

	            if (this._scalingPromise) {
	                return this._scalingPromise;
	            }

	            this._scalingPromise = this.ScalingService.getScaling().then(function (newScaling) {
	                _this._scaling = newScaling;

	                _this._unwatchScalingUpdated = _this.$rootScope.$on('scaling:updated', function (ev, newScalingData) {
	                    _.merge(_this._scaling, newScalingData);

	                    _this.ToastService.success('Scaling updated.');
	                });

	                _this._unwatchScalingError = _this.$rootScope.$on('scaling:error', function (ev, err) {
	                    _this.ToastService.error(err);
	                });

	                return _this._scaling;
	            });
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            if (this._unwatchScalingError) {
	                this._unwatchScalingError();
	                this._unwatchScalingError = void 0;
	            }

	            if (this._unwatchScalingUpdated) {
	                this._unwatchScalingUpdated();
	                this._unwatchScalingUpdated = void 0;
	            }

	            this._scaling = void 0;
	            this._scalingPromise = void 0;
	        }
	    }, {
	        key: 'updateScaling',
	        value: function updateScaling(newScaling) {
	            return this.ScalingService.updateScaling(newScaling);
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    Service.$inject = ["Restangular"];
	    function Service(Restangular) {
	        'ngInject';

	        _classCallCheck(this, Service);

	        this.BASE = Restangular.all('stats');
	    }

	    _createClass(Service, [{
	        key: 'getAll',
	        value: function getAll(retention) {
	            var qs = {};

	            if (retention) {
	                qs.retention = retention;
	            }

	            return this.BASE.getList(qs).then(function (data) {
	                return data.plain();
	            });
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	    function Service() {
	        'ngInject';

	        _classCallCheck(this, Service);

	        toastr.options.timeOut = 2000;
	        toastr.options.positionClass = 'toast-bottom-right';
	        toastr.options.preventDuplicates = true;
	        toastr.options.progressBar = false;
	    }

	    _createClass(Service, [{
	        key: 'success',
	        value: function success(text) {
	            toastr.success(text);
	        }
	    }, {
	        key: 'warning',
	        value: function warning(text) {
	            toastr.warning(text);
	        }
	    }, {
	        key: 'error',
	        value: function error(text) {
	            toastr.error(text);
	        }
	    }]);

	    return Service;
	}();

	exports.default = Service;

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = filter;
	function filter() {
	    return function (value) {
	        if (!value || !value.hostname) {
	            return 'no IP';
	        }

	        return value.hostname;
	    };
	}

/***/ }
/******/ ]);
angular.module('myApp').run(['$templateCache', function($templateCache) {$templateCache.put('app/home/home.html','<div class="home"><navbar></navbar><div ui-view=""></div></div>');
$templateCache.put('app/login/login.html','<div class="login"><div class="container"><div class="row"><div class="col-md-6 col-md-offset-4"><div class="login-logo"><img src="assets/images/logo400.png"></div><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Please sign in</h3></div><div class="panel-body"><form name="myForm" role="form" no-validate="" ng-submit="vm.login()"><fieldset><div class="form-group" ng-class="{\'has-error\': myForm.password.$invalid && myForm.password.$dirty}"><input class="form-control" placeholder="Password" name="password" type="password" ng-model="vm.password" required=""> <span class="help-block" ng-messages="myForm.password.$error" ng-show="myForm.password.$invalid && myForm.password.$dirty"><span ng-message="required">Password is empty</span></span></div><input class="btn btn-lg btn-success btn-block" type="submit" value="Login" ng-disabled="myForm.$invalid"></fieldset></form></div></div></div></div></div></div>');
$templateCache.put('app/home/instances/instances.html','<section class="instances"><div class="container-fluid"><div class="row"><div class="col-xs-12"><div class="panel panel-default"><div class="panel-heading"><div class="panel-title">Instances<div class="instances-scaling pull-right">Min: <span ng-bind="vm.scaling.min"></span> / Required: <span ng-bind="vm.scaling.required"></span> / Max: <span ng-bind="vm.scaling.max"></span><div class="btn-group" role="group"><button class="btn btn-default btn-xs" type="button" ng-click="vm.scaleMax()"><i class="icon icon-starting"></i></button> <button class="btn btn-default btn-xs" type="button" ng-click="vm.openScalingModal()">Scaling</button> <button class="btn btn-default btn-xs" type="button" ng-click="vm.scaleMin()"><i class="icon icon-stopping"></i></button></div></div></div></div><div class="panel-body"><div class="row"><div class="col-sm-2" ng-repeat="instance in vm.instances track by instance.content.name" ng-show="vm.instances.length > 0"><instance container="instance"></instance></div><div class="col-sm-12 list-empty" ng-show="vm.instances.length <= 0"><i class="icon icon-empty"></i> <span>No instance found</span></div></div></div></div></div></div></div></section>');
$templateCache.put('app/home/navbar/navbar.html','<nav class="navbar navbar-default navbar-fixed-top"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle" ng-init="navCollapsed = true" ng-click="navCollapsed = !navCollapsed"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button><div class="navbar-brand"><img src="assets/images/logo35h.png"></div></div><div class="navbar-collapse" ng-class="{collapse: navCollapsed}"><ul class="nav navbar-nav"><li ui-sref-active="active"><a ui-sref="home.instances">Instances</a></li><li ui-sref-active="active"><a ui-sref="home.stats">Stats</a></li></ul><ul class="nav navbar-nav navbar-right"><li><a ng-click="vm.logout()"><i class="icon icon-sign-out"></i> Logout</a></li></ul></div></div></nav>');
$templateCache.put('app/home/stats/stats.html','<section class="stats"><div class="container-fluid"><div class="row"><div class="col-xs-12"><div class="panel panel-default stats-global"><div class="panel-heading"><div class="panel-title">Global stats<div class="btn-group pull-right" role="group"><button type="button" class="btn btn-default btn-xs" ng-class="{\'active\': vm.scale === 60000}" ng-click="vm.scale = 60000">1m</button> <button type="button" class="btn btn-default btn-xs" ng-class="{\'active\': vm.scale === 300000}" ng-click="vm.scale = 300000">5m</button> <button type="button" class="btn btn-default btn-xs" ng-class="{\'active\': vm.scale === 600000}" ng-click="vm.scale = 600000">10m</button> <button type="button" class="btn btn-default btn-xs" ng-class="{\'active\': vm.scale === 3600000}" ng-click="vm.scale = 3600000">1h</button> <button type="button" class="btn btn-default btn-xs" ng-class="{\'active\': vm.scale === 18000000}" ng-click="vm.scale = 18000000">5h</button> <button type="button" class="btn btn-default btn-xs" ng-class="{\'active\': vm.scale === 86400000}" ng-click="vm.scale = 86400000">1d</button></div></div></div><div class="panel-body"><div class="row"><div class="stats-global-item col-sm-6">Count of Requests: <span ng-bind="vm.global.rq_count"></span></div><div class="stats-global-item col-sm-6">Received: <span ng-bind="vm.global.kbytes_received"></span>kb / Sent: <span ng-bind="vm.global.kbytes_sent"></span>kb</div></div><div class="row"><div class="stats-global-item col-sm-6">Count of Stop orders: <span ng-bind="vm.global.stop_order_count"></span></div><div class="stats-global-item col-sm-6">Requests before stop (min/avg/max): <span ng-if="vm.global.rq_before_stop"><span ng-bind="vm.global.rq_before_stop.min"></span> / <span ng-bind="vm.global.rq_before_stop.avg"></span> / <span ng-bind="vm.global.rq_before_stop.max"></span></span> <span ng-if="!vm.global.rq_before_stop">none</span></div></div></div></div></div><div class="col-xs-12"><div class="panel panel-default"><div class="panel-heading"><div class="panel-title">Count of Requests</div></div><div class="panel-body"><timechart columns="vm.requests.columns" data="vm.requests.data"></timechart></div></div></div><div class="col-xs-12"><div class="panel panel-default"><div class="panel-heading"><div class="panel-title">Flow</div></div><div class="panel-body"><timechart columns="vm.flow.columns" data="vm.flow.data"></timechart></div></div></div><div class="col-xs-12"><div class="panel panel-default"><div class="panel-heading"><div class="panel-title">Count of Stop orders</div></div><div class="panel-body"><timechart columns="vm.stop_order_count.columns" data="vm.stop_order_count.data"></timechart></div></div></div></div></div></section>');
$templateCache.put('app/home/instances/instance/instance.html','<div class="instance"><div class="instance-info"><div class="instance-name" ng-bind="vm.container.content.name | limitTo:13"></div><div class="instance-address" ng-bind="vm.container.content.address | address"></div><div class="instance-icons"><div class="instance-type"><i class="icon" ng-class="vm.IconsService.getProviderType(vm.container.content.type)"></i></div><div class="instance-status"><i class="icon" ng-class="vm.IconsService.getStatus(vm.container.content.status)"></i></div><div class="instance-alive"><i class="icon" ng-class="vm.IconsService.isAlive(vm.container.content.alive)"></i></div></div></div><div class="instance-button" ng-click="vm.kill()"><i class="icon icon-stopped"></i></div></div>');
$templateCache.put('app/home/instances/scaling/scaling.html','<div class="modal-container scaling"><div class="modal-header"><h3 class="modal-title">Update scaling</h3></div><div class="modal-body"><form class="form-inline" name="scalingForm"><div class="form-group" ng-class="{\'has-error\': scalingForm.scalingMin.$invalid}"><label for="scalingMin">Min:</label> <input type="number" class="form-control" id="scalingMin" name="scalingMin" ng-model="vm.scaling.min" required=""></div><div class="form-group" ng-class="{\'has-error\': scalingForm.scalingRequired.$invalid}"><label for="scalingRequired">Required:</label> <input type="number" class="form-control" id="scalingRequired" name="scalingRequired" ng-model="vm.scaling.required" scaling-validator="" scmin="vm.scaling.min" scmax="vm.scaling.max" required=""></div><div class="form-group" ng-class="{\'has-error\': scalingForm.scalingMax.$invalid}"><label for="scalingMax">Max:</label> <input type="number" class="form-control" id="scalingMax" name="scalingMax" ng-model="vm.scaling.max" required=""></div><div class="help-block has-error" ng-messages="scalingForm.$error" ng-show="scalingForm.$invalid"><div ng-message="required">All fields are required</div><div ng-message="scmin">Required must be less or equal than Min</div><div ng-message="scmax">Required must be greater or equal than Max</div></div></form></div><div class="modal-footer"><button class="btn btn-primary" type="button" ng-click="vm.ok()" ng-disabled="scalingForm.$invalid">Update</button> <button class="btn btn-warning" type="button" ng-click="vm.cancel()">Cancel</button></div></div>');}]);