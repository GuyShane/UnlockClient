import Socket from './socket';

import * as dom from './dom';

import {makeSchema, enforce} from './enforcer';
import {normalize, alter} from './color';
import {isEmpty} from './utils';

import './unlock.scss';

export function init(opts){
    const unlocker=new Unlocker(opts);
}

const url='https://unlock-app.com/';

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
        dom.$(self.opts.email);
        dom.$('#unlock-button');
        self.opts.color=normalize(self.opts.color);

        self.socket=new Socket(self.opts.url, data=>{
            self.enableButton();
            self.opts.onMessage(data);
        });

        self.unlock=self._unlock.bind(self);

        self.buildButton();
        if (self.opts.submitOnEnter){
            dom.onEnter(self.opts.email, self.unlock);
        }
    }

    get email(){
        return dom.val(this.opts.email);
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
        const b=dom.$('#unlock-button')
              .querySelector('#ul-button');
        dom.offClick(b, this.unlock);
        dom.onClick(b, this.unlock);
        b.classList.remove('ul-disabled');
        b.classList.add('ul-enabled');
    }

    disableButton(){
        const b=dom.$('#unlock-button')
              .querySelector('#ul-button');
        dom.offClick(b, this.unlock);
        b.classList.remove('ul-enabled');
        b.classList.add('ul-disabled');
    }

    buildButton(){
        const b=dom.$('#unlock-button');
        if (b.querySelector('#ul-button')){
            const clone=b.cloneNode(true);
            b.parentNode.replaceChild(clone, b);
        }
        else {
            let html='<div id="ul-button" class="ul-enabled">'+
                '<img id="ul-logo" src="'+url+'images/unlock-logo-text.svg" alt="unlock">'+
                '<span id="ul-cover"></span><div id="ul-spinner"><div id="ul-dot-one" class="ul-dot">'+
                '</div><div id="ul-dot-two" class="ul-dot"></div><div id="ul-dot-three" class="ul-dot">'+
                '</div></div></div>';
            if (this.opts.whatsThis){
                html+='<div id="ul-link">What\'s this?</div>'+
                    '<div id="ul-modal" class="ul-d-none">'+
                    '<div id="ul-modal-overlay"></div>'+
                    '<div id="ul-modal-container">'+
                    '<div id="ul-modal-logo-container">'+
                    '<img id="ul-modal-logo" src="'+url+'images/unlock-icon.svg"></div>'+
                    '<div id="ul-modal-close">&times;</div>'+
                    '<div id="ul-modal-content">'+
                    '</div></div></div>';
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
        dom.insertRules(styles);
    }

    setupModal(){
        if (!this.opts.whatsThis){return;}

        const link=dom.$('#ul-link');
        const container=dom.$('#ul-modal');
        const overlay=dom.$('#ul-modal-overlay');
        const modal=dom.$('#ul-modal-content');
        const x=dom.$('#ul-modal-close');

        const open=this.openModal.bind(null, container);
        const close=this.closeModal.bind(null, container);

        dom.onClick(link, open);
        dom.onClick(overlay, close);
        dom.onClick(x, close);
        dom.onClick(modal, e=>e.stopPropagation());

        this.makeModalContent();
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

    handleInput(evt){
        const self=this;
        if (!self.reader){
            self.reader=new FileReader();
            self.reader.onload=e=>self.makePreview(e.target.result);
        }
        self.reader.readAsDataURL(evt.target.files[0]);
    }

    makeModalContent(){
        const html='<div id="ul-modal-title">Sign up for Unlock</div>'+
              '<div id="ul-modal-description">'+
              'Unlock allows you to sign up and log in '+
              'to web based applications without ever needing '+
              'a password. You need to create an Unlock account '+
              'once, and then you can use it on any participating '+
              'site or app. Learn more at '+
              '<a href="https://unlock-app.com" target="_blank">the Unlock website</a></div>'+
              '<input id="ul-modal-email" type="email" placeholder="Enter your email address">'+
              '<div id="ul-modal-picture"></div>'+
              '<div id="ul-modal-picture-description">'+
              '<div>*Make sure you use a picture that clearly shows your face, '+
              'and only contains you in it.</div>'+
              '<div>Your picture is never stored or shared with anyone. '+
              'It is converted into a number and then encrypted. The number is only '+
              'used when you log in to the Unlock website.</div></div>'+
              '<button id="ul-modal-signup">Sign up</button>';
        const container=dom.$('#ul-modal-content');
        dom.transition(container, html, ()=>{
            const signup=dom.$('#ul-modal-signup');
            dom.onClick(signup, this.signup.bind(this));
            this.makePictureActions();
        });
    }

    makePictureActions(){
        this.image='';
        const html='<div id="ul-modal-picture-buttons">'+
              '<button id="ul-modal-picture-take" class="ul-button">Take</button>'+
              ' or <button id="ul-modal-picture-upload" class="ul-button">upload</button>'+
              '<input id="ul-modal-picture-input" type="file" accept="image/*">'+
              '</div><div id="ul-modal-picture-text">a picture of yourself*</div>';
        const pic=dom.$('#ul-modal-picture');
        dom.transition(pic, html, ()=>{
            const take=dom.$('#ul-modal-picture-take');
            const upload=dom.$('#ul-modal-picture-upload');
            const input=dom.$('#ul-modal-picture-input');
            dom.onClick(take, this.makeCamera.bind(this));
            dom.onClick(upload, ()=>input.click());
            input.addEventListener('change', this.handleInput.bind(this));
        });
    }

    makeCamera(){
        const html='<div>Camera</div>';
        const container=dom.$('#ul-modal-content');
        dom.transition(container, html);
    }

    makePreview(src){
        this.image=src;
        const html='<div id="ul-modal-preview">'+
              '<img id="ul-modal-preview-picture" src="'+src+'">'+
              '<div id="ul-modal-preview-close">&times;</div></div>';
        const pic=dom.$('#ul-modal-picture');
        dom.transition(pic, html, ()=>{
            dom.onClick(dom.$('#ul-modal-preview-close'), this.makePictureActions.bind(this));
        });
    }

    signup(){
        const email=dom.val('#ul-modal-email');
        fetch(url+'api/signup', {
            method: 'POST',
            headers: {'content-type': 'text/plain'},
            body: JSON.stringify({email, image: this.image})
        });
    }
}
