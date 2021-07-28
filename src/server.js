const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8181
});

let clients = [];

//连接上就会多一个client
wss.on('connection', function (client, req) {
    //有数据就会触发client.on     'message'    data是传上来的数据
    let user = {};
    client.on('message', function (msg) {
        const {
            type,
            data
        } = JSON.parse(msg);
        switch (type) {
            case 'login':
                user = data;
                userLogin();
                break;
            case 'startRoll':
                userStartRoll();
                break;
            case 'endRoll':
                userEndRoll(data);
                break;
            case 'selectDice':
                userSelectDice(data);
                break;
            case 'confirmScore':
                userConfirmScore(data);
                break;
            default:
                break;
        }
    });

    client.on("close", (msg) => {
        userLeave()
    })

    function userLogin() {
        client.send(JSON.stringify({
            type: 'initData',
            data: {
                clients,
                myInfo: user
            }
        }));
        clients.push(user);
        broadcast('userJoin', user)
    }

    function userStartRoll() {
        broadcast('userStartRoll', user)
    }

    function userEndRoll(data) {
        broadcast('userEndRoll', {
            user: user,
            dice: data.dice,
            times: data.times
        })
    }

    function userSelectDice(data) {
        broadcast('userSelectDice', data)
    }

    function userConfirmScore(data) {
        const {player, position} = data
        broadcast('userConfirmScore', {
            player,
            position
        });
    }

    function userLeave() {
        let index = clients.findIndex(item => item.id = user.id);
        if (index > -1) clients.splice(index, 1);
        broadcast('userLeave', user)
    }

    function broadcast(type, data) {
        wss.clients.forEach(item => {
            if (item === client) return;
            item.send(JSON.stringify({
                type: type,
                data: data
            }))
        })
    }
});
