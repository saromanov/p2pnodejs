'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var P2PNodejs = (function () {
    function P2PNodejs(name) {
        _classCallCheck(this, P2PNodejs);

        this.name = name;

        //list of known addresses
        this.known = new Map();
        this.blocked = new Map();

        this.socket = undefined;
    }

    _createClass(P2PNodejs, [{
        key: 'connect',
        value: function connect(host, port, msg) {
            var socket = _net2['default'].createConnection(port, host);
            socket.on("data", function (response) {
                console.log("Getting data: ", response.toString("utf-8"));
                var buffer = new Buffer(msg, "utf-8");
                var out = new Buffer(msg.length + 24);
                buffer.copy(out, 24);
                response.write(msg);
            }).on("connect", function () {
                console.log("Connected");
            }).on("error", function (data) {
                console.log(data);
            });
            this.socket = socket;
            console.log(this.socket);
        }
    }, {
        key: 'receive',
        value: function receive() {
            while (true) {}
        }
    }, {
        key: 'send',
        value: function send(addr, data) {}

        //Add address for blocked list
    }, {
        key: 'addBlocked',
        value: function addBlocked(items) {
            for (var item in items) {
                this.blocked.set(item, 1);
            }
        }
    }, {
        key: 'startServer',
        value: function startServer() {
            var _this = this;

            var host = arguments.length <= 0 || arguments[0] === undefined ? '127.0.0.1' : arguments[0];
            var port = arguments.length <= 1 || arguments[1] === undefined ? 12345 : arguments[1];

            var server = _net2['default'].createServer(function (socket) {
                var addr = socket.remoteAddress + ':' + socket.remotePort;
                if (_this.blocked.hasOwnProperty(addr)) {
                    socket.write("This address in the black list");
                    socket.end();
                } else {
                    _this.known.set(addr, []);
                    socket.write("Listen connections: ");
                }

                socket.on('data', function (data) {
                    console.log("This is data: ", data);
                });

                socket.end();
            });

            server.listen(port, host);
        }
    }]);

    return P2PNodejs;
})();

exports.P2PNodejs = P2PNodejs;