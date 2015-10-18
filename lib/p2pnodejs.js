'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var P2PNodejs = (function (_events$EventEmitter) {
    _inherits(P2PNodejs, _events$EventEmitter);

    function P2PNodejs(name) {
        _classCallCheck(this, P2PNodejs);

        _get(Object.getPrototypeOf(P2PNodejs.prototype), 'constructor', this).call(this);
        this.name = name;

        //list of known addresses
        this.known = new Map();
        this.blocked = new Map();

        this.socket = undefined;
    }

    _createClass(P2PNodejs, [{
        key: 'connect',
        value: function connect(host, port, msg) {
            var _this = this;

            var socket = _net2['default'].createConnection(port, host);
            this.socket = socket;
            socket.on("data", function (response) {
                console.log("Getting data: ", response.toString("utf-8"));
            }).on("connect", function () {
                _this.socket = socket;
                console.log("Connected");
            }).on("error", function (data) {
                console.log(data);
            });
        }
    }, {
        key: 'receive',
        value: function receive() {
            while (true) {}
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(data) {
            var msg = 'message: ' + data;
            var buffer = new Buffer(msg);
            this.socket.write(buffer);
        }

        //Add address for blocked list
    }, {
        key: 'addBlocked',
        value: function addBlocked(items) {
            if (items.length === 0) {
                return;
            }
            for (var item in items) {
                this.blocked.set(item, 1);
            }
        }
    }, {
        key: 'genUUID',
        value: function genUUID() {
            return _nodeUuid2['default'].v4();
        }
    }, {
        key: 'startServer',
        value: function startServer() {
            var _this2 = this;

            var host = arguments.length <= 0 || arguments[0] === undefined ? '127.0.0.1' : arguments[0];
            var port = arguments.length <= 1 || arguments[1] === undefined ? 12345 : arguments[1];

            console.log('Start listen on ' + host + ':' + port);
            var server = _net2['default'].createServer(function (socket) {
                var addr = socket.remoteAddress + ':' + socket.remotePort;
                if (_this2.blocked.hasOwnProperty(addr)) {
                    socket.write("This address in the black list");
                    socket.end();
                } else {
                    _this2.known.set(addr, []);
                    socket.write("Listen connections: ");
                }

                socket.on('data', function (data) {
                    var show = addr + ' : ' + data.toString('utf-8');
                    _this2.emit('message', show);
                });

                socket.end();
            });

            server.listen(port, host);
        }
    }]);

    return P2PNodejs;
})(_events2['default'].EventEmitter);

exports.P2PNodejs = P2PNodejs;