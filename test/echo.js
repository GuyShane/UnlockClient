const WebSocket=require('ws');

const ws=new WebSocket.Server({
    port: 3456
});

ws.on('connection', (socket)=>{
    socket.on('message', (msg)=>{
        socket.send(msg);
        socket.close();
    });
});
