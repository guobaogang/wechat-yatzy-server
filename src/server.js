const WebSocket = require('ws');

let user = null, clients=[];
const wss = new WebSocket.Server({
    port: 8181
});

//连接上就会多一个client
wss.on('connection', function (client, req) {
    //有数据就会触发client.on     'message'    data是传上来的数据
    user = client;
    client.on('message', function (msg) {
        console.log(JSON.stringify(msg))
        const {
            type,
            data
        } = JSON.parse(msg);
        switch (type) {
            case 'login':
                userLogin(client, data);
                break;
            case 'myMsg':
                showAllClient();
                break;
            default:
                break;
        }
    });

    client.on("close", (msg) => {
        userLeave()
    })
});

function showAllClient() {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            type: 'userJoin',
            data: client.id
        }))
    })
}

function userLogin(client, userInfo){
    user.userInfo = userInfo;
    client.send(JSON.stringify({
        type: 'initData',
        data: {
            clients,
            myInfo: userInfo
        }
    }));
    clients.push(userInfo);
    broadcast('userJoin', userInfo)
}

function userLeave(){
    console.log(user.userInfo.id + '断开连接')
    let index = clients.findIndex(item=>item.id = user.userInfo.id);
    if(index> -1) clients.splice(index,1);
    user.send(JSON.stringify({
        type: 'userLeave',
        data: user.userInfo
    }))
    broadcast('userLeave', user.userInfo)
}

function broadcast(type,data){
    wss.clients.forEach(client => {
        if(client.userInfo.id === user.userInfo.id) return;
        client.send(JSON.stringify({
            type: type,
            data: data
        }))
    })
}