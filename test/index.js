let ws;
function connectWebsocket() {
    let url = `ws://localhost:8181`;

    ws = new WebSocket(url);

    ws.onopen = function () {
        console.log("连接成功!");
        ws.send(
            JSON.stringify({
                type: "setSocketId",
                data: 111
            })
        );
    };
    ws.onclose = function () {
        // 关闭 websocket
        console.log("连接已关闭...正在重连...");
        //connectWebsocket()
    };
    ws.onmessage = res => {
        console.log("收到socket消息:", res.data)
        document.querySelector('#content').innerHTML += res.data;
    };
}

connectWebsocket()


function sendMsg(){
    ws.send(JSON.stringify({
        type: "myMsg",
        data: '123123123'
    }))
}