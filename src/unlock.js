import Socket from './socket';

import {makeSchema, enforce} from './enforcer';
import {find, val, insertRules, addOnEnter} from './dom';
import {normalize, alter} from './color';
import {isEmpty} from './utils';

import './unlock.scss';

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
        find('#unlock-button');
        self.opts.color=normalize(self.opts.color);

        self.socket=new Socket(self.opts.url, data=>{
            self.enableButton();
            self.opts.onMessage(data);
        });

        self.unlock=self._unlock.bind(self);

        self.buildButton();
        if (self.opts.submitOnEnter){
            addOnEnter(self.opts.email, self.unlock);
        }
    }

    get email(){
        return val(this.opts.email);
    }

    _unlock(){
        if (this.email===''){return;}
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
              .querySelector('#ul-button');
        b.removeEventListener('click', this.unlock);
        b.addEventListener('click', this.unlock);
        b.classList.remove('ul-disabled');
        b.classList.add('ul-enabled');
    }

    disableButton(){
        const b=document.querySelector('#unlock-button')
              .querySelector('#ul-button');
        b.removeEventListener('click', this.unlock);
        b.classList.remove('ul-enabled');
        b.classList.add('ul-disabled');
    }

    buildButton(){
        const b=document.querySelector('#unlock-button');
        if (b.querySelector('#ul-button')){
            const clone=b.cloneNode(true);
            b.parentNode.replaceChild(clone, b);
        }
        else {
            let html='<div id="ul-button" class="ul-enabled">'+
                '<img id="ul-logo" src="https://www.unlock-app.com/images/unlock-logo-text.svg" alt="unlock">'+
                '<span id="ul-cover"></span><div id="ul-spinner"><div id="ul-dot-one" class="ul-dot">'+
                '</div><div id="ul-dot-two" class="ul-dot"></div><div id="ul-dot-three" class="ul-dot">'+
                '</div></div></div>';
            if (this.opts.whatsThis){
                html+='<div id="ul-link">What\'s this?</div>';
                html+='<div id="ul-modal" class="ul-d-none">';
                html+='<div id="ul-modal-overlay">';
                html+='<div id="ul-modal-content">';
                html+='<div id="ul-modal-logo"></div>';
                html+='<div id="ul-modal-close">&times;</div>';
                html+='</div></div></div>';
            }
            b.innerHTML=html;
        }
        this.addColor();
        this.setupModal();
        this.enableButton();
    }

    addColor(){
        const bg=this.opts.color;
        const light=alter(bg, true);
        const dark=alter(bg, false);
        const styles=[
            `#unlock-button #ul-button {background-color: ${bg}}`,
            `#unlock-button #ul-button.ul-enabled:hover {background-color: ${light}}`,
            `#unlock-button #ul-button.ul-enabled:active {background-color: ${dark}}`,
        ];
        if (this.opts.whatsThis){
            styles.push(`#unlock-button #ul-link {color: ${bg}}`);
        }
        insertRules(styles);
    }

    setupModal(){
        if (!this.opts.whatsThis){return;}
        const self=this;
        const link=document.querySelector('#ul-link');
        const container=document.querySelector('#ul-modal');
        const overlay=document.querySelector('#ul-modal-overlay');
        const modal=document.querySelector('#ul-modal-content');
        const x=document.querySelector('#ul-modal-close');
        link.addEventListener('click', self.openModal.bind(null, container));
        overlay.addEventListener('click', self.closeModal.bind(null, container));
        x.addEventListener('click', self.closeModal.bind(null, container));
        modal.addEventListener('click', e=>e.stopPropagation());
    }

    openModal(container){
        container.classList.remove('ul-d-none');
        window.setTimeout(()=>{
            container.classList.add('ul-open');
        });
    }

    closeModal(container){
        container.classList.remove('ul-open');
        window.setTimeout(()=>{
            container.classList.add('ul-d-none');
        }, 200);
    }
}
