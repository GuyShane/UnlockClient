(function(root, factory) {
    if (typeof define==='function' && define.amd) {
        define([], factory);
    } else if (typeof exports==='object') {
        module.exports=factory();
    } else {
        root.Unlock=factory();
    }
}(this, function() {
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
            buttonId: {
                required: false,
                type: 'string',
                default: '#unlock-button'
            },
            submitOnEnter: {
                required: false,
                type: 'boolean',
                default: false
            },
            whatsThis: {
                required: false,
                type: 'boolean',
                default: false
            },
            color: {
                required: false,
                type: 'string',
                default: '#2f81c6'
            },
            extra: {
                required: false,
                type: 'object',
                default: {}
            },
            onSend: {
                required: false,
                type: 'function',
                default: function(){}
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
        self.extra=opts.extra;
        self.button=opts.button;
        self.buttonId=verifyElem(opts.buttonId);
        self.submitOnEnter=opts.submitOnEnter;
        self.whatsThis=opts.whatsThis;
        self.color=normalizeColor(opts.color);

        self.onMessage=opts.onMessage;
        self.onSend=opts.onSend;
        self.onOpen=opts.onOpen;
        self.onClose=opts.onClose;

        self.socket=new WebSocket(self.url);
        self.open=false;
        self.shouldSend=false;
        self._setupSocket();

        if (self.button){
            self.onclick=self._submit.bind(self);
            self._buildButton();
            if (self.submitOnEnter){
                var input=document.querySelector(self.email);
                input.onkeyup=function(e){
                    var key=e.which||e.keyCode;
                    if (key===13){
                        self.onclick();
                    }
                };
            }
        }
    }

    Unlock.prototype.unlock=function(){
        var self=this;
        self.onSend();
        var data={
            type: 'unlock',
            email: self._getEmail()
        };
        if (!isEmpty(self.extra)){
            data.extra=self.extra;
        }
        self.socket.send(JSON.stringify(data));
    };

    Unlock.prototype.isOpen=function(){
        return this.open;
    };

    Unlock.prototype.enableButton=function(){
        var self=this;
        if (!self.button){
            return;
        }
        var b=document.querySelector(self.buttonId)
            .querySelector('.unlock-button');
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
        var b=document.querySelector(self.buttonId)
            .querySelector('.unlock-button');
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
            self.socket=undefined;
            self.open=false;
            self.onClose();
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
        return document.querySelector(this.email).value;
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
        var b=document.querySelector(self.buttonId);
        if (b.querySelector('.unlock-logo')){
            var clone=b.cloneNode(true);
            b.parentNode.replaceChild(clone, b);
        }
        else {
            var html='<div id="_unlock-button" class="unlock-enabled">'+
                '<img id="_unlock-logo" src="https://www.unlock-app.com/images/unlock-logo-text.svg">'+
                '<span id="_unlock-cover"></span><div id="_unlock-spinner"><div id="_unlock-dot-one" class="unlock-dot">'+
                '</div><div id="_unlock-dot-two" class="unlock-dot"></div><div id="_unlock-dot-three" class="unlock-dot">'+
                '</div></div></div>';
            if (self.whatsThis){
                html+='<div id="_unlock-link"><a href="https://www.unlock-app.com" target="_blank">What\'s this?</a></div>';
            }
            b.innerHTML=html;
        }
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
        sheet.insertRule(self.buttonId+' .unlock-button {background-color: '+bg+'}', sheet.cssRules.length);
        sheet.insertRule(self.buttonId+' .unlock-button.unlock-enabled:hover {background-color: '+light+'}', sheet.cssRules.length);
        sheet.insertRule(self.buttonId+' .unlock-button.unlock-enabled:active {background-color: '+dark+'}', sheet.cssRules.length);
        if (self.whatsThis){
            sheet.insertRule(self.buttonId+' .unlock-link a {color: '+bg+'}', sheet.cssRules.length);
        }
    };

    function verifyElem(id){
        if (!document.querySelector(id)){
            throw new Error('No element found with id '+id);
        }
        return id;
    }

    return Unlock;
}));
