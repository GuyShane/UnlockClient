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
        self.email=verifyElem(opts.email);
        self.button=opts.button;
        self.color=normalizeColor(opts.color);

        self.onMessage=opts.onMessage;
        self.onOpen=opts.onOpen;
        self.onClose=opts.onClose;

        self.socket=new WebSocket(self.url);
        self.open=false;
        self.shouldSend=false;
        self._setupSocket();

        if (self.button){
            self.buttonId='unlock-button';
            self.onclick=self._submit.bind(self);
            self._buildButton();
        }
    }

    Unlock.prototype.unlock=function(){
        var self=this;
        self.socket.send(JSON.stringify({
            type: 'unlock',
            email: self._getEmail()
        }));
    };

    Unlock.prototype.isOpen=function(){
        return this.open;
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

    Unlock.prototype._setupSocket=function(){
        var self=this;
        self.socket.onopen=function(){
            self.open=true;
            if (self.shouldSend){
                self.unlock();
                self.shouldSend=false;
            }
            self.onOpen();
        };

        self.socket.onclose=function(){
            self.onClose();
            self.socket=undefined;
            self.open=false;
        };

        self.socket.onmessage=function(event){
            var data;
            try {
                data=JSON.parse(event.data);
            }
            catch (err) {
                data=event.data;
            }
            if(self.button){
                self.enableButton();
            }
            self.onMessage(data);
        };

        self.socket.onerror=function(err){
            throw err;
        };
    };

    Unlock.prototype._getEmail=function(){
        return document.getElementById(this.email).value;
    };

    Unlock.prototype._submit=function(){
        var self=this;
        if (self.open){
            self.disableButton();
            self.unlock();
        }
        else {
            self.shouldSend=true;
        }
    };

    Unlock.prototype._buildButton=function(){
        var self=this;
        var b=document.getElementById(self.buttonId);
        if (!b){
            throw new Error('You need to place an element with the id "unlock-button" on your page');
        }
        b.classList.add('unlock-enabled');
        var html='<img id="unlock-logo" src="https://www.unlock-auth.com/images/unlock-logo-text.svg">'+
            '<span id="unlock-cover"></span><div id="unlock-spinner"><div class="unlock-dot" id="unlock-dot-one">'+
            '</div><div class="unlock-dot" id="unlock-dot-two"></div><div class="unlock-dot" id="unlock-dot-three"></div></div>';
        b.innerHTML=html;
        self._addColor();
        self.enableButton();
    };

    Unlock.prototype._addColor=function(){
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
        if (typeof obj==='undefined'){
            throw new Error('You need to supply an options object');
        }
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

    function verifyElem(id){
        if (!document.getElementById(id)){
            throw new Error('No element found with id '+id);
        }
        return id;
    }

    function normalizeColor(c){
        var match=c.match(/^#?([0-9a-f]{6})$/i);
        if (match){
            return ('#'+match[1]).toLowerCase();
        }
        match=c.match(/^#?([1-9a-f])([1-9a-f])([1-9a-f])$/i);
        if (match){
            return ('#'+match[1]+match[1]+match[2]+match[2]+match[3]+match[3]).toLowerCase();
        }
        var numMatch='[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]';
        var rgbRegex=new RegExp('^rgb\\(('+numMatch+'), ?('+numMatch+'), ?('+numMatch+')\\)$');
        match=c.match(rgbRegex);
        if (match){
            return ('#'+format(match[1])+
                    format(match[2])+
                    format(match[3])).toLowerCase();
        }
        throw new Error('Unrecognized color '+c+'. Must be either hex or rgb format');
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
        num=parseInt(num);
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
