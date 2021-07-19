const WebSocket = require('ws');

let user = null;
const wss = new WebSocket.Server({
    port: 4000
});

//连接上就会多一个client
wss.on('connection', function (client, req) {
    user = client;
    //有数据就会触发client.on     'message'    data是传上来的数据
    client.on('message', function (msg) {
        console.log(wss.clients)
        const {
            type,
            data
        } = JSON.parse(msg);
        switch (type) {
            case 'setSocketId':
                client.id = data;
                break;
            case 'myMsg':
                showAllClient();
                break;
            default:
                break;
        }
    });

    client.on("close", (msg) => {
        console.log("与前端断开连接")
    })
});

function showAllClient() {
    wss.clients.forEach(client => {
        console.log(client.id)
    })
}