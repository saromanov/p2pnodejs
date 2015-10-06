import net from 'net';
import events from 'events';


export class P2PNodejs {
    constructor(name){
        this.name = name;

        //list of known addresses
        this.known = new Map();
        this.blocked = new Map();

        this.socket = undefined;
    }

    connect(host, port, msg) {
        let socket = net.createConnection(port, host);
        socket.on("data", (response) => {
            console.log("Getting data: ", response.toString("utf-8"));
            let buffer = new Buffer(msg, "utf-8");
            let out = new Buffer(msg.length + 24);
            buffer.copy(out, 24);
            response.write(msg);

        }).on("connect", () => {
            console.log("Connected");
        }).on("error", (data) => {
          console.log(data);  
        });
        this.socket = socket;
        console.log(this.socket);
    }

    receive() {
        while(true) {

        }
    }

    send(addr, data) {

    }

    //Add address for blocked list
    addBlocked(items) {
        for(let item in items) {
            this.blocked.set(item,1);
        }
    }

    startServer(host='127.0.0.1', port=12345) {
        let server = net.createServer((socket) => {
            let addr = `${socket.remoteAddress}:${socket.remotePort}`;
            if(this.blocked.hasOwnProperty(addr)) {
                socket.write("This address in the black list");
                socket.end();
            } else {
                this.known.set(addr, []);
                socket.write("Listen connections: ");
            }

            socket.on('data', (data) => {
                console.log("This is data: ", data);
            });

            socket.end();

        });

        server.listen(port, host); 
    }
}
