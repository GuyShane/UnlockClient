# Unlock

## A client side library for authenticating with Unlock
This is a library to include in your frontend which will open a WebSocket connection to your Unlock enabled server and get you up and running with simple, socket-based authentication.

If you haven't set up your server for Unlock yet, check out [the website](https://www.unlock-auth.com/documentation) for more information and documentation.

[![Build Status](https://travis-ci.org/GuyShane/UnlockClient.svg?branch=master)](https://travis-ci.org/GuyShane/UnlockClient)

### Installing
Download [unlock.min.css](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.min.css) and [unlock.min.js](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.min.js) (or [unlock.css](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.css) and [unlock.js](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.js)), then include them in the relevant places
```html
...
<link rel="stylesheet" href="unlock.min.css" />
...
<script type="text/javascript" src="unlock.min.js"></script>
...
```

### Usage
This library exports a class, Unlock, to the global space which you interact with to create connections. The class is initialized with an options object to specify its behaviour.
```html
...
<div>
    <input type="email" id="email" />
    <div id="unlock-button"></div>
</div>
...
<script>
var unlocker=new Unlock({
    url: 'ws://localhost',
    email: 'email',
    onMessage: function(data){
        console.log(data);
    }
});
</script>
...
```

### API

#### var unlocker=new Unlock(options)
| Name | Type | Attributes | Default | Description |
| ---- | ---- | ---------- | ------- | ----------- |
| url | string | required | - | The url for the socket to connect to. |
| email | string | required | - | The id of the input element where the user enters their email address. |
| onMessage | function | required | - | A function to be called when the socket receices data. |
| button | boolean | optional | true | Whether or not to use the built in button. |
| buttonId | string | optional | 'unlock-button' | The id of the button used to submit requests. |
| color | string | optional | '#2f81c6' | The background color of the button. |
| onOpen | function | optional | - | A function called when the socket connection is open. |
| onClose | function | optional | - | A function called if/when the socket connection closes. |

If `button` is set to `true` (the default), Unlock will handle calling unlock(), adding and removing click listeners, and general state management. You won't need to worry about calling the methods yourself unless you pass `button: false` or if you have some custom state management.

#### unlocker.unlock()
Sends an unlock request using the options information given to the constructor. It will grab whatever is in the email field at the time it is called and passes it along to the server to be processed further.

#### unlocker.isOpen() -> *boolean*
Returns true if the socket connection is open, otherwise returns false.

#### unlocker.enableButton()
If the object was initialized with `button: true`, this will add a listener to submit an Unlock request when the button is clicked, as well as style the button accordingly. If `button: false` was passed, this method won't do anything.

#### unlocker.disableButton()
If the object was initialized with `button: true`, this will remove the click listener to submit requests, and it will style the button with a waiting animation. If `button: false` was passed, this method won't do anything.
