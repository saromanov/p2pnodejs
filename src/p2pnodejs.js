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
        this.socket = socket;
        socket.on("data", (response) => {
            console.log("Getting data: ", response.toString("utf-8"));
        }).on("connect", () => {
            this.socket = socket;
            console.log("Connected");
        }).on("error", (data) => {
          console.log(data);  
        });
    }

    receive() {
        while(true) {

        }
    }

    sendMessage(data) {
        let msg = `message: ${data}`;
        let buffer = new Buffer(msg);
        this.socket.write(buffer);
    }

    //Add address for blocked list
    addBlocked(items) {
        if(items.length === 0) {
            return;
        }
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
                let show = `${addr} : ${data.toString('utf-8')}`;
                console.log(show);
            });

            socket.end();

        });

        server.listen(port, host); 
    }
}
