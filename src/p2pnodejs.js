import net from 'net';
import events from 'events';


export class P2PNodejs {
    construct(name){
        this.name = name;

        //list of known addresses
        this.known = [];

        this.socket = undefined;
    }

    connect(host, port, msg) {
        let socket = net.createConnection(port, host);
        socket.on("data", (response) => {
            console.log("Getting data: ", response.toString("utf-8"));
            let buffer = new Buffer(msg, "utf-8");
            let out = new Buffer(msg.length + 24);
            buffer.copy(out, 24);
            response.write(msg, null);

        }).on("connect", () => {
            console.log("Connected");
        }).on("error", (data) => {
          console.log(data);  
        });
        this.socket = socket;
    }

    receive() {
        while(true) {

        }
    }

    send(addr, data) {

        let buffer = new Buffer(data);
        this.socket.write(addr, data);
    }

    startServer(host='127.0.0.1', port=12345) {
        let server = net.createServer((socket) => {
            console.log(socket.remoteAddress, socket.remotePort);
            socket.write("Listen connections: ");
            socket.end();
        });

        server.listen(port, host); 
    }
}
