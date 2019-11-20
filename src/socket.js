class Socket {
    constructor(url, onMessage){
        this.url=url;
        this.onMessage=onMessage;
        this.open=false;
        this.actions=[];
        this.socket=new WebSocket(this.url);

        this.socket.onopen=this.onOpen;
        this.socket.onclose=this.onClose;
        this.socket.onmessage=this.onMessage;
    }

    onOpen(){
        this.open=true;
        while(this.actions.length){
            const a=this.actions.pop();
            this.send(a);
        }
    }

    onClose(){
        this.socket=undefined;
        this.open=false;
    }

    onMessage(evt){
        let data;
        try {
            data=JSON.parse(evt.data);
        }
        catch(err) {
            data=evt.data;
        }
        this.onMessage(data);
    }

    send(data){
        if (!this.open){
            this.actions.push(data);
        }
        else {
            this.socket.send(JSON.stringify(data));
        }
    }
}

export default Socket;
