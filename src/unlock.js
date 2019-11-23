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
                '<img id="ul-logo" src="https://unlock-app.com/images/unlock-logo-text.svg" alt="unlock">'+
                '<span id="ul-cover"></span><div id="ul-spinner"><div id="ul-dot-one" class="ul-dot">'+
                '</div><div id="ul-dot-two" class="ul-dot"></div><div id="ul-dot-three" class="ul-dot">'+
                '</div></div></div>';
            if (this.opts.whatsThis){
                html+='<div id="ul-link">What\'s this?</div>';
                html+='<div id="ul-modal" class="ul-d-none">';
                html+='<div id="ul-modal-overlay">';
                html+='<div id="ul-modal-container">';
                html+='<div id="ul-modal-logo-container">';
                html+='<img id="ul-modal-logo" src="https://unlock-app.com/images/unlock-icon.svg"></div>';
                html+='<div id="ul-modal-close">&times;</div>';
                html+='<div id="ul-modal-content">';
                html+='<div id="ul-modal-title">Sign up for Unlock</div>';
                html+='<div id="ul-modal-description">';
                html+='Unlock allows you to sign up and log in ';
                html+='to web based applications without ever needing ';
                html+='a password. You need to create an Unlock account ';
                html+='once, and then you can use it on any participating ';
                html+='site or app. Learn more at ';
                html+='<a href="https://unlock-app.com" target="_blank">the Unlock website</a></div>';
                html+='<input id="ul-modal-email" type="email" placeholder="Enter your email address">';
                html+='<div id="ul-modal-picture">';
                html+='<div id="ul-modal-picture-buttons">';
                html+='<button id="ul-modal-picture-take" class="ul-button">Take</button>';
                html+=' or <button id="ul-modal-picture-upload" class="ul-button">upload</button>';
                html+='</div><div id="ul-modal-picture-text">a picture of yourself*</div></div>';
                html+='<div id="ul-modal-picture-description">';
                html+='<div>*Make sure you use a picture that clearly shows your face, ';
                html+='and only contains you in it.</div>';
                html+='<div>Your picture is never stored or shared with anyone. ';
                html+='It is converted into a number and then encrypted. The number is only ';
                html+='used when you log in to the Unlock website.</div></div>';
                html+='<button id="ul-modal-signup">Sign up</button>';
                html+='</div></div></div></div>';
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
