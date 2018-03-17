(function(){
    function Unlock(opts){
        var self=this;

        opts=verify(opts, {
            url: {
                required: true,
                type: 'string'
            },
            email: {
                required: true,
                type: 'string'
            },
            onMessage: {
                required: true,
                type: 'function'
            },
            button: {
                required: false,
                type: 'boolean',
                default: true
            },
            color: {
                required: false,
                type: 'string',
                default: '#2f81c6'
            },
            onOpen: {
                required: false,
                type: 'function',
                default: function(){}
            },
            onClose: {
                required: false,
                type: 'function',
                default: function(){}
            }
        });

        self.url=opts.url;
        self.email=opts.email;
        self.button=opts.button;
        self.color=opts.color;

        self.onMessage=opts.onMessage;
        self.onOpen=opts.onOpen;
        self.onClose=opts.onClose;

        self.socket=new WebSocket(self.url);
        self.isOpen=false;
        self.shouldSend=false;
        self.setupSocket();

        if (self.button){
            self.buttonId='unlock-button';
            self.onclick=self.submit.bind(self);
            self.buildButton();
        }
    }

    Unlock.prototype.unlock=function(){
        var self=this;
        self.socket.send(JSON.stringify({
            type: 'unlock',
            email: self.getEmail()
        }));
    };

    Unlock.prototype.setupSocket=function(){
        var self=this;
        self.socket.onopen=function(){
            self.onOpen();
            self.isOpen=true;
            if (self.shouldSend){
                self.unlock();
                self.shouldSend=false;
            }
        };

        self.socket.onclose=function(){
            self.onClose();
            self.socket=undefined;
            self.isOpen=false;
        };

        self.socket.onmessage=function(event){
            var data;
            try {
                data=JSON.parse(event.data);
            }
            catch (err) {
                data=event;
            }
            if(self.button){
                self.enableButton();
            }
            self.onMessage(data);
        };
    };

    Unlock.prototype.getEmail=function(){
        return document.getElementById(this.email).value;
    };

    Unlock.prototype.submit=function(){
        var self=this;
        if (self.isOpen){
            self.disableButton();
            self.unlock();
        }
        else {
            self.shouldSend=true;
        }
    };

    Unlock.prototype.enableButton=function(){
        var self=this;
        if (!self.button){
            return;
        }
        var b=document.getElementById(self.buttonId);
        b.removeEventListener('click', self.onclick);
        b.addEventListener('click', self.onclick);
        b.classList.remove('unlock-disabled');
        b.classList.add('unlock-enabled');
    };

    Unlock.prototype.disableButton=function(){
        var self=this;
        if (!self.button){
            return;
        }
        var b=document.getElementById(self.buttonId);
        b.removeEventListener('click', self.onclick);
        b.classList.remove('unlock-enabled');
        b.classList.add('unlock-disabled');
    };

    Unlock.prototype.buildButton=function(){
        var self=this;
        var b=document.getElementById(self.buttonId);
        b.classList.add('unlock-enabled');
        var html='<img id="unlock-logo" src="https://www.unlock-auth.com/images/unlock-logo-text.svg">'+
            '<span id="unlock-cover"></span><div id="unlock-spinner"><div class="unlock-dot" id="unlock-dot-one">'+
            '</div><div class="unlock-dot" id="unlock-dot-two"></div><div class="unlock-dot" id="unlock-dot-three"></div></div>';
        b.innerHTML=html;
        self.addColor();
        self.enableButton();
    };

    Unlock.prototype.addColor=function(){
        var self=this;
        var bg=self.color;
        var light=alter(self.color, true);
        var dark=alter(self.color, false);
        var style=document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        var sheet=style.sheet;
        sheet.insertRule('#unlock-button {background-color: '+bg+'}', sheet.cssRules.length);
        sheet.insertRule('#unlock-button.unlock-enabled:hover {background-color: '+light+'}', sheet.cssRules.length);
        sheet.insertRule('#unlock-button.unlock-enabled:active {background-color: '+dark+'}', sheet.cssRules.length);
    };

    function verify(obj, schema){
        var ret={};
        var key;
        for (key in obj){
            if (!obj.hasOwnProperty(key)){continue;}
            if (typeof schema[key]==='undefined'){
                throw new Error('Unrecognized option '+key);
            }
        }
        for (key in schema){
            if (!schema.hasOwnProperty(key)){continue;}
            var reqs=schema[key];
            var val=obj[key];
            if (typeof val==='undefined'){
                if (reqs.required){
                    throw new Error('Value '+key+' must be defined and of type '+reqs.type);
                }
                else {
                    ret[key]=reqs.default;
                }
            }
            else {
                if (typeof val!==reqs.type){
                    throw new Error('Value '+key+' must be of type '+reqs.type);
                }
                ret[key]=val;
            }
        }
        return ret;
    }

    function alter(c, up){
        c=c.slice(1);
        var delta=30;
        if (!up){
            delta*=-1;
        }
        var cnum=parseInt(c, 16);
        var newR=format((cnum>>16)+delta);
        var newB=format((cnum>>8&0x00ff)+delta);
        var newG=format((cnum&0x0000ff)+delta);
        return '#'+newR+newB+newG;
    }

    function format(num){
        if (num>255){num=255;}
        if (num<0){num=0;}
        var s=num.toString(16);
        if (s.length===1){
            s='0'+s;
        }
        return s;
    }

    window.Unlock=Unlock;
})();
