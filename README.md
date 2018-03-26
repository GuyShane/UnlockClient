# Unlock

## A client side library for authenticating with Unlock
This is a library to include in your frontend which will open a WebSocket connection to your Unlock enabled server and get you up and running with simple, socket-based, passwordless authentication.

If you haven't set up your server for Unlock yet, check out [the website](https://www.unlock-auth.com/documentation) for more information and documentation.

[![Build Status](https://travis-ci.org/GuyShane/UnlockClient.svg?branch=master)](https://travis-ci.org/GuyShane/UnlockClient)
[![npm version](https://badge.fury.io/js/unlock-client.svg)](https://badge.fury.io/js/unlock-client)

### Installing
Download [unlock.min.css](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.min.css) and [unlock.min.js](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.min.js) (or [unlock.css](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.css) and [unlock.js](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/src/unlock.js)), then include them in the relevant places
```html
...
<link rel="stylesheet" href="unlock.min.css" />
...
<script type="text/javascript" src="unlock.min.js"></script>
...
```

Unlock is also available via npm:

`npm install unlock-client`

and bower:

`bower install unlock-client`

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
    email: '#email',
    onMessage: function(data){
        console.log(data);
    }
});
</script>
...
```

### API

#### var unlocker=new Unlock(options)
Constructs a new Unlock object with the specified options. The behaviour can be set as follows:

| Name | Type | Attributes | Default | Description |
| ---- | ---- | ---------- | ------- | ----------- |
| url | string | required | - | The url for the socket to connect to. This is the url of your WebSocket server which communicates with Unlock. |
| email | string | required | - | The id of the input element where the user enters their email address. Should contain a leading hash. For example: '#email' |
| onMessage | function | required | - | A function to be called when the socket receices data. The function is passed one argument: `onMessage(data)` It is the data that was sent through the socket. If the data was JSON, Unlock will parse it first and onMessage will be called with the object, otherwise onMessage will be called with whatever was sent. Typical actions would be storing an authentication cookie and refreshing/redirecting, or handling any errors that occurred. |
| button | boolean | optional | true | Whether or not to use the built in button. |
| buttonId | string | optional | '#unlock-button' | The id of the button used to submit requests. If a custom button id is specified, it must start with 'unlock-button' to receive styling. For example: '#unlock-button-2'. |
| color | string | optional | '#2f81c6' | The background color of the button. Unlock will also automatically set the :hover and :active states to be lighter and darker than the specified color, respectively. Accepted inputs are hex (3 or 6 characters), and rgb() |
| onOpen | function | optional | - | A function called when the socket connection is open. `unlocker.isOpen()` will return true at this point. |
| onClose | function | optional | - | A function called if/when the socket connection closes. `unlocker.isOpen()` will return false at this point. As well, the internal socket object will be removed. If another connection is required, you can construct a new Unlock object. |

If `button` is set to `true` (the default), Unlock will handle calling `unlock()`, adding and removing click listeners, and general state management. You won't need to worry about calling the methods yourself unless you pass `button: false` or if you have some custom state management.

#### unlocker.unlock()
Sends an unlock request using the options information given to the constructor. It will grab whatever is in the email field at the time it is called and passes it along to the server to be processed further.

#### unlocker.isOpen() -> *boolean*
Returns true if the socket connection is open, otherwise returns false.

#### unlocker.enableButton()
If the object was initialized with `button: true`, this will add a listener to submit an Unlock request when the button is clicked, as well as style the button accordingly. If `button: false` was passed, this method won't do anything.

#### unlocker.disableButton()
If the object was initialized with `button: true`, this will remove the click listener to submit requests, and it will style the button with a waiting animation. If `button: false` was passed, this method won't do anything.

### Running tests
Clone the repo and run
```
npm install
npm run echo:start
npm test
```
eco:start starts a simple node WebSocket server on localhost:3456 for use with the tests

### License
[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2018 Shane Brass
