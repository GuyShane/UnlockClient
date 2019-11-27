(function () {var f={};function l(o){return new z(o)}class m{constructor(s,t){this.url=s,this.onMessage=t,this.open=!1,this.actions=[],this.socket=new WebSocket(this.url),this.socket.onopen=this.onOpen.bind(this),this.socket.onclose=this.onClose.bind(this),this.socket.onmessage=this._onMessage.bind(this)}onOpen(){for(this.open=!0;this.actions.length;){const s=this.actions.pop();this.send(s)}}onClose(){this.socket=void 0,this.open=!1}_onMessage(s){let t;try{t=JSON.parse(s.data)}catch(e){t=s.data}this.onMessage(t)}send(s){this.open?this.socket.send(JSON.stringify(s)):this.actions.push(s)}}function b(e){const t=document.querySelector(e);if(!t)throw new Error("No element found with id "+e);return t}function j(e){return document.querySelector(e).value}function n(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function e(e,t,o,$){const r=o?200:0;e.classList.add("ul-bb"),setTimeout(()=>{n(e),e.innerHTML=t,e.classList.remove("ul-bb"),e.classList.add("ul-bg"),setTimeout(()=>{e.classList.remove("ul-bg"),$()},r)},r)}function p(e){const t=document.createElement("style");t.appendChild(document.createTextNode("")),document.head.appendChild(t);const o=t.sheet;e.forEach(e=>{o.insertRule(e,o.cssRules.length)})}function c(e,t){e.addEventListener("click",t)}function i(e,t){e.removeEventListener("click",t)}function q(e,t){document.querySelector(e).onkeyup=e=>{13===(e.which||e.keyCode)&&t()}}async function r(){const t=navigator.mediaDevices;return!(!t||!t.enumerateDevices)&&(await t.enumerateDevices()).some(t=>"videoinput"===t.kind)}async function s(t){const e=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{max:1280}},audio:!1});return t.srcObject=e,t.play(),e}function u(t,e){const a=e.getContext("2d");return e.width=t.videoWidth,e.height=t.videoHeight,a.translate(e.width,0),a.scale(-1,1),a.drawImage(t,0,0,e.width,e.height),e.toDataURL("image/png")}function g(t){t.getTracks()[0].stop()}function a(e,r,o){return{required:e,type:r,fallback:o}}function v(e,r){if(void 0===e)throw new Error("You need to supply an options object");var o,t={};for(o in e)if(Object.prototype.hasOwnProperty.call(e,o)&&void 0===r[o])throw new Error("Unrecognized option "+o);for(o in r)if(Object.prototype.hasOwnProperty.call(r,o)){var n=r[o],p=e[o];if(void 0===p){if(n.required)throw new Error("Value "+o+" must be defined and of type "+n.type);t[o]=n.fallback}else{if(typeof p!==n.type)throw new Error("Value "+o+" must be of type "+n.type);t[o]=p}}return t}function w(r){var e=r.match(/^#?([0-9a-f]{6})$/i);if(e)return("#"+e[1]).toLowerCase();if(e=r.match(/^#?([1-9a-f])([1-9a-f])([1-9a-f])$/i))return("#"+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]).toLowerCase();var t="[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]",$=new RegExp("^rgb\\(("+t+"), ?("+t+"), ?("+t+")\\)$");if(e=r.match($))return("#"+d(e[1])+d(e[2])+d(e[3])).toLowerCase();throw new Error("Unrecognized color "+r+". Must be either hex or rgb format")}function k(r,e){r=r.slice(1);var t=30;e||(t*=-1);var $=parseInt(r,16);return"#"+d(($>>16)+t)+d(($>>8&255)+t)+d((255&$)+t)}function d(r){(r=parseInt(r))>255&&(r=255),r<0&&(r=0);var e=r.toString(16);return 1===e.length&&(e="0"+e),e}function t(t){return 0===Object.keys(t).length}f.init=l;const h="https://unlock-app.com/",x="https://play.google.com/store/apps/details?id=com.unlockauth.unlock",y="https://apps.apple.com/ca/app/unlock-authentication/id1380362354";class z{constructor(o){const t=this,i={url:a(!0,"string"),email:a(!0,"string"),onMessage:a(!0,"function"),submitOnEnter:a(!1,"boolean",!1),whatsThis:a(!1,"boolean",!1),color:a(!1,"string","#2f81c6"),extra:a(!1,"object",{})};t.opts=v(o,i),b(t.opts.email),b("#unlock-button"),t.opts.color=w(t.opts.color),t.loading=!1,t.socket=new m(t.opts.url,o=>{t.enableButton(),t.opts.onMessage(o)}),t.unlock=t._unlock.bind(t),t.buildButton(),t.opts.submitOnEnter&&q(t.opts.email,t.unlock)}get email(){return j(this.opts.email)}_unlock(){if(""===this.email)return;this.disableButton();const o={type:"Unlock",email:this.email};t(this.opts.extra)||(o.extra=this.opts.extra),this.socket.send(o)}enableButton(){const o=b("#ul-bj");i(o,this.unlock),c(o,this.unlock),o.classList.remove("ul-bc"),o.classList.add("ul-bh")}disableButton(){const o=b("#ul-bj");i(o,this.unlock),o.classList.remove("ul-bh"),o.classList.add("ul-bc")}buildButton(){const o=b("#unlock-button");if(o.querySelector("#ul-bj")){const t=o.cloneNode(!0);o.parentNode.replaceChild(t,o)}else{let t="<button id='ul-bj' class='ul-bh'><img id='ul-bm' src='"+h+"images/unlock-logo-text.svg' alt='unlock'><span id='ul-bl'></span><div class='ul-bd'><div class='ul-bp ul-bf'></div><div class='ul-bp ul-be'></div><div class='ul-bp ul-ba'></div></div></button>";this.opts.whatsThis&&(t+="<div id='ul-bn'>What's this?</div><div id='ul-bk' class='ul-bi'><div id='ul-ao'></div><div id='ul-an'><div id='ul-ad'><img id='ul-az' src='"+h+"images/unlock-icon.svg'></div><div id='ul-ay'>&times;</div><div id='ul-ap'></div></div></div>"),o.innerHTML=t}this.addColor(),this.setupModal(),this.enableButton()}addColor(){const o=this.opts.color,t=[`#unlock-button #ul-bj {background-color: ${o}}`,`#unlock-button #ul-bj.ul-bh:hover {background-color: ${k(o,!0)}}`,`#unlock-button #ul-bj.ul-bh:active {background-color: ${k(o,!1)}}`];this.opts.whatsThis&&t.push(`#unlock-button #ul-bn {color: ${o}}`),p(t)}setupModal(){if(!this.opts.whatsThis)return;const o=b("#ul-bn"),t=b("#ul-bk"),i=b("#ul-ao"),e=b("#ul-ap"),a=b("#ul-ay"),l=this.openModal.bind(this,t),m=this.closeModal.bind(this,t);c(o,l),c(i,m),c(a,m),c(e,o=>o.stopPropagation())}openModal(o){o.classList.remove("ul-bi"),window.setTimeout(()=>{o.classList.add("ul-bo")}),this.makeModalContent()}closeModal(o){this.stream&&g(this.stream),this.image="",o.classList.remove("ul-bo"),window.setTimeout(()=>{o.classList.add("ul-bi")},200)}handleInput(o){const t=this;t.reader||(t.reader=new FileReader,t.reader.onload=o=>t.makePreview(o.target.result)),t.reader.readAsDataURL(o.target.files[0])}makeModalContent(){const o=b("#ul-ap");e(o,"<div class='ul-aw'>Sign up for Unlock</div><div>Unlock allows you to sign up and log in to web based applications without ever needing a password. You need to create an Unlock account once, and then you can use it on any participating site or app. Learn more at <a href='https://unlock-app.com' target='_blank'>the Unlock website</a></div><input id='ul-ax' type='email' placeholder='Enter your email address'><div id='ul-as'></div><div id='ul-aa'><div>*Make sure you use a picture that clearly shows your face, and only contains you in it.</div><div>Your picture is never stored or shared with anyone. It is converted into a number and then encrypted. The number is only used when you log in to the Unlock website.</div></div><div id='ul-av'></div><button id='ul-au' class='ul-bh'><div id='ul-al'>Sign up</div><div class='ul-bd'><div class='ul-bp ul-bf'></div><div class='ul-bp ul-be'></div><div class='ul-bp ul-ba'></div></div></button>",!1,()=>{const o=b("#ul-au");c(o,this.signup.bind(this)),this.makePictureActions()})}makePictureActions(){this.image="";const o=b("#ul-as");e(o,"<div id='ul-ab'><button id='ul-ak' class='ul-bj'>Take</button> or <button id='ul-ae' class='ul-bj'>upload</button><input id='ul-ag' type='file' accept='image/*'></div><div>a picture of yourself*</div>",!0,()=>{const o=b("#ul-ak"),t=b("#ul-ae"),i=b("#ul-ag");c(o,this.makeCamera.bind(this)),c(t,()=>i.click()),i.addEventListener("change",this.handleInput.bind(this))})}async makeCamera(){if(!(await r()))return void alert("No camera detected on this device");const o=b("#ul-as");e(o,"<div id='ul-at'><video id='ul-aj'></video><canvas id='ul-af'></canvas><button id='ul-am'><svg width='25' height='18' viewBox='0 0 72 53' fill='none' stroke='white' stroke-width='6' xmlns='http://www.w3.org/2000/svg'><circle cx='36' cy='31' r='11.5'/><path d='M2.5 15.5V47.5C2.5 49.1569 3.84315 50.5 5.5 50.5H66.5C68.1569 50.5 69.5 49.1569 69.5 47.5V15.5C69.5 13.8431 68.1569 12.5 66.5 12.5H52.5C50.8431 12.5 49.5 11.1569 49.5 9.5V5.5C49.5 3.84315 48.1569 2.5 46.5 2.5H25.5C23.8431 2.5 22.5 3.84315 22.5 5.5V9.5C22.5 11.1569 21.1569 12.5 19.5 12.5H5.5C3.84315 12.5 2.5 13.8431 2.5 15.5Z'/></svg></button><div id='ul-ai'>&times</div></div>",!0,async()=>{const o=b("#ul-aj"),t=b("#ul-af"),i=b("#ul-ai"),e=b("#ul-am");this.stream=await s(o),c(i,()=>{g(this.stream),this.makePictureActions()}),c(e,()=>{const i=u(o,t);g(this.stream),this.makePreview(i)})})}makePreview(o){this.image=o;const t="<div id='ul-aq'><img id='ul-ac' src='"+o+"'><div id='ul-ah'>&times;</div></div>",i=b("#ul-as");e(i,t,!0,()=>{c(b("#ul-ah"),this.makePictureActions.bind(this))})}makeSuccess(){const o="<div id='ul-ar'><div class='ul-aw'>Signup complete!</div><div>You now have an Unlock account, and can access all participating sites without ever needing a password.</div><div>You should have received a verification email. Once you confirm your email you can start using Unlock.</div><div>You can start right away by receiving Unlock requests to your email, but you can also download the app for <a href='"+x+"' target='_blank'>Android</a> or <a href='"+y+"' target='_blank'>iOS</a> at any time.</div></div>",t=b("#ul-ap");e(t,o,!0,()=>{})}async signup(){if(this.loading)return;this.loading=!0;const o=b("#ul-au"),t=b("#ul-av");t.innerText="",o.classList.remove("ul-bh"),o.classList.add("ul-bc");const i=j("#ul-ax"),e=await fetch(h+"api/signup",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:i,image:this.image})});if(this.loading=!1,o.classList.remove("ul-bc"),o.classList.add("ul-bh"),e.ok)this.makeSuccess();else{const o=await e.json();t.innerText=o.message}}}if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f}else if(typeof define==="function"&&define.amd){define(function(){return f})}else{this["Unlock"]=f}})();