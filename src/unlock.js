import Socket from './socket';

import * as dom from './dom';
import * as camera from './camera';

import {makeSchema, enforce} from './enforcer';
import {normalize, alter} from './color';
import {isEmpty} from './utils';

import './unlock.scss';

export function init(opts){
    return new Unlocker(opts);
}

const url='https://unlock-app.com/';
const androidUrl='https://play.google.com/store/apps/details?id=com.unlockauth.unlock';
const iosUrl='https://apps.apple.com/ca/app/unlock-authentication/id1380362354';

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
        self.loading=false;

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
            type: 'unlock',
            email: this.email
        };
        if (!isEmpty(this.opts.extra)){
            data.extra=this.opts.extra;
        }
        this.socket.send(data);
    }

    enableButton(){
        const b=dom.$('#ul-button');
        dom.offClick(b, this.unlock);
        dom.onClick(b, this.unlock);
        b.classList.remove('ul-disabled');
        b.classList.add('ul-enabled');
    }

    disableButton(){
        const b=dom.$('#ul-button');
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
            let html="<button id='ul-button' class='ul-enabled'>"+
                "<img id='ul-logo' src='"+url+"images/unlock-logo-text.svg' alt='unlock'>"+
                "<span id='ul-cover'></span><div class='ul-spinner'><div class='ul-dot ul-dot-one'>"+
                "</div><div class='ul-dot ul-dot-two'></div><div class='ul-dot ul-dot-three'>"+
                "</div></div></button>";
            if (this.opts.whatsThis){
                html+="<div id='ul-link'>What's this?</div>"+
                    "<div id='ul-modal' class='ul-d-none'>"+
                    "<div id='ul-modal-overlay'></div>"+
                    "<div id='ul-modal-container'>"+
                    "<div id='ul-modal-logo-container'>"+
                    "<img id='ul-modal-logo' src='"+url+"images/unlock-icon.svg'></div>"+
                    "<div id='ul-modal-close'>&times;</div>"+
                    "<div id='ul-modal-content'>"+
                    "</div></div></div>";
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
            `#unlock-button #ul-button.ul-enabled:active {background-color: ${dark}}`
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

        const open=this.openModal.bind(this, container);
        const close=this.closeModal.bind(this, container);

        dom.onClick(link, open);
        dom.onClick(overlay, close);
        dom.onClick(x, close);
        dom.onClick(modal, e=>e.stopPropagation());
    }

    openModal(container){
        container.classList.remove('ul-d-none');
        window.setTimeout(()=>{
            container.classList.add('ul-open');
        });
        this.makeModalContent();
    }

    closeModal(container){
        if (this.stream){
            camera.stop(this.stream);
        }
        this.image='';
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
        const html="<div class='ul-modal-title'>Sign up for Unlock</div>"+
              "<div>"+
              "Unlock allows you to sign up and log in "+
              "to web based applications without ever needing "+
              "a password. You need to create an Unlock account "+
              "once, and then you can use it on any participating "+
              "site or app. Learn more at "+
              "<a href='https://unlock-app.com' target='_blank'>the Unlock website</a></div>"+
              "<input id='ul-modal-email' type='email' placeholder='Enter your email address'>"+
              "<div id='ul-modal-picture'></div>"+
              "<div id='ul-modal-picture-description'>"+
              "<div>*Make sure you use a picture that clearly shows your face, "+
              "and only contains you in it.</div>"+
              "<div>Your picture is never stored or shared with anyone. "+
              "It is converted into a number and then encrypted. The number is only "+
              "used when you log in to the Unlock website.</div></div>"+
              "<div id='ul-modal-error'></div>"+
              "<button id='ul-modal-signup' class='ul-enabled'><div id='ul-modal-signup-text'>Sign up</div>"+
              "<div class='ul-spinner'><div class='ul-dot ul-dot-one'>"+
              "</div><div class='ul-dot ul-dot-two'></div><div class='ul-dot ul-dot-three'>"+
              "</div></div></button>";
        const container=dom.$('#ul-modal-content');
        dom.transition(container, html, false, ()=>{
            const signup=dom.$('#ul-modal-signup');
            dom.onClick(signup, this.signup.bind(this));
            this.makePictureActions();
        });
    }

    makePictureActions(){
        this.image='';
        const html="<div id='ul-modal-picture-buttons'>"+
              "<button id='ul-modal-picture-take' class='ul-button'>Take</button>"+
              " or <button id='ul-modal-picture-upload' class='ul-button'>upload</button>"+
              "<input id='ul-modal-picture-input' type='file' accept='image/*'>"+
              "</div><div>a picture of yourself*</div>";
        const pic=dom.$('#ul-modal-picture');
        dom.transition(pic, html, true, ()=>{
            const take=dom.$('#ul-modal-picture-take');
            const upload=dom.$('#ul-modal-picture-upload');
            const input=dom.$('#ul-modal-picture-input');
            dom.onClick(take, this.makeCamera.bind(this));
            dom.onClick(upload, ()=>input.click());
            input.addEventListener('change', this.handleInput.bind(this));
        });
    }

    async makeCamera(){
        if (!await camera.hasCamera()){
            alert('No camera detected on this device');
            return;
        }
        const icon="<svg width='25' height='18' viewBox='0 0 72 53' "+
              "fill='none' stroke='white' stroke-width='6' "+
              "xmlns='http://www.w3.org/2000/svg'>"+
              "<circle cx='36' cy='31' r='11.5'/>"+
              "<path d='M2.5 15.5V47.5C2.5 "+
              "49.1569 3.84315 50.5 5.5 50.5H66.5C68.1569 50.5 "+
              "69.5 49.1569 69.5 47.5V15.5C69.5 13.8431 68.1569 "+
              "12.5 66.5 12.5H52.5C50.8431 12.5 49.5 11.1569 "+
              "49.5 9.5V5.5C49.5 3.84315 48.1569 2.5 46.5 "+
              "2.5H25.5C23.8431 2.5 22.5 3.84315 22.5 5.5V9.5C22.5 "+
              "11.1569 21.1569 12.5 19.5 12.5H5.5C3.84315 12.5 "+
              "2.5 13.8431 2.5 15.5Z'/></svg>";
        const html="<div id='ul-modal-camera'>"+
              "<video id='ul-modal-camera-video'></video>"+
              "<canvas id='ul-modal-camera-canvas'></canvas>"+
              "<button id='ul-modal-camera-take'>"+icon+"</button>"+
              "<div id='ul-modal-camera-close'>&times</div>"+
              "</div>";
        const pic=dom.$('#ul-modal-picture');
        dom.transition(pic, html, true, async ()=>{
            const video=dom.$('#ul-modal-camera-video');
            const canvas=dom.$('#ul-modal-camera-canvas');
            const x=dom.$('#ul-modal-camera-close');
            const take=dom.$('#ul-modal-camera-take');
            this.stream=await camera.start(video);
            dom.onClick(x, ()=>{
                camera.stop(this.stream);
                this.makePictureActions();
            });
            dom.onClick(take, ()=>{
                const img=camera.capture(video, canvas);
                camera.stop(this.stream);
                this.makePreview(img);
            });
        });
    }

    makePreview(src){
        this.image=src;
        const html="<div id='ul-modal-preview'>"+
              "<img id='ul-modal-preview-picture' src='"+src+"'>"+
              "<div id='ul-modal-preview-close'>&times;</div></div>";
        const pic=dom.$('#ul-modal-picture');
        dom.transition(pic, html, true, ()=>{
            dom.onClick(dom.$('#ul-modal-preview-close'), this.makePictureActions.bind(this));
        });
    }

    makeSuccess(){
        const html="<div id='ul-modal-success'><div class='ul-modal-title'>"+
              "Signup complete!</div><div>You now have an Unlock account, and can access "+
              "all participating sites without ever needing a password.</div>"+
              "<div>You should have received a verification email. Once you "+
              "confirm your email you can start using Unlock.</div>"+
              "<div>You can start right away by receiving Unlock requests to your email, "+
              "but you can also download the app for <a href='"+androidUrl+"' target='_blank'>Android</a> "+
              "or <a href='"+iosUrl+"' target='_blank'>iOS</a> at any time.</div></div>";
        const container=dom.$('#ul-modal-content');
        dom.transition(container, html, true, ()=>{});
    }

    async signup(){
        if (this.loading){return;}
        this.loading=true;
        const signup=dom.$('#ul-modal-signup');
        const error=dom.$('#ul-modal-error');
        error.innerText='';
        signup.classList.remove('ul-enabled');
        signup.classList.add('ul-disabled');
        const email=dom.val('#ul-modal-email');
        const resp=await fetch(url+'api/signup', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({email, image: this.image})
        });
        this.loading=false;
        signup.classList.remove('ul-disabled');
        signup.classList.add('ul-enabled');
        if (resp.ok){
            this.makeSuccess();
        }
        else {
            const data=await resp.json();
            error.innerText=data.message;
        }
    }
}
