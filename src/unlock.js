import Socket from './socket';

import {makeSchema, enforce} from './enforcer';
import {find, val, insertRules, addOnEnter} from './dom';
import {normalize, alter} from './color';
import {isEmpty} from './utils';

export function init(opts){
    const unlocker=new Unlocker(opts);
}

class Unlocker {
    constructor(opts){
        const self=this;

        const schema={
            url: makeSchema(true, 'string'),
            email: makeSchema(true, 'string'),
            onMessage: makeSchema(true, 'function'),
            submitOnEnter: makeSchema(false, 'boolean', false),
            whatsThis: makeSchema(false, 'boolean', false),
            color: makeSchema(false, 'string', '#2f81c6'),
            extra: makeSchema(false, 'object', {})
        };

        self.opts=enforce(opts, schema);
        find(self.opts.email);
        self.opts.color=normalize(self.opts.color);

        self.socket=new Socket(self.opts.url, data=>{
            self.enableButton();
            self.opts.onMessage(data);
        });

        self.buildButton();
        if (self.opts.submitOnEnter){
            addOnEnter(self.opts.email, self.unlock);
        }
    }

    get email(){
        return val(this.email);
    }

    unlock(){
        this.disableButton();
        const data={
            type: 'Unlock',
            email: this.email
        };
        if (!isEmpty(this.opts.extra)){
            data.extra=this.opts.extra;
        }
        this.socket.send(data);
    }

    enableButton(){
        const b=document.querySelector('#unlock-button')
              .querySelector('#_unlock-button');
        b.removeEventListener('click', this.unlock);
        b.addEventListener('click', this.unlock);
        b.classList.remove('unlock-disabled');
        b.classList.add('unlock-enabled');
    }

    disableButton(){
        const b=document.querySelector('#unlock-button')
              .querySelector('#_unlock-button');
        b.removeEventListener('click', this.unlock);
        b.classList.remove('unlock-enabled');
        b.classList.add('unlock-disabled');
    }

    buildButton(){
        var b=document.querySelector('#unlock-button');
        if (b.querySelector('#_unlock-button')){
            var clone=b.cloneNode(true);
            b.parentNode.replaceChild(clone, b);
        }
        else {
            var html='<div id="_unlock-button" class="unlock-enabled">'+
                '<img id="_unlock-logo" src="https://www.unlock-app.com/images/unlock-logo-text.svg">'+
                '<span id="_unlock-cover"></span><div id="_unlock-spinner"><div id="_unlock-dot-one" class="unlock-dot">'+
                '</div><div id="_unlock-dot-two" class="unlock-dot"></div><div id="_unlock-dot-three" class="unlock-dot">'+
                '</div></div></div>';
            if (this.opts.whatsThis){
                html+='<div id="_unlock-link"><a href="https://www.unlock-app.com" target="_blank">What\'s this?</a></div>';
            }
            b.innerHTML=html;
        }
        this.addColor();
        this.enableButton();
    }

    addColor(){
        const bg=self.opts.color;
        const light=alter(bg, true);
        const dark=alter(bg, false);
        const styles=[
            `#unlock-button #_unlock-button {background-color: ${bg}}`,
            `#unlock-button #_unlock-button.unlock-enabled:hover {background-color: ${light}}`,
            `#unlock-button #_unlock-button.unlock-enabled:active {background-color: ${dark}}`,
        ];
        if (this.opts.whatsThis){
            styles.push(`#unlock-button #_unlock-link a {color: ${bg}}`);
        }
        insertRules(styles);
    }
}
