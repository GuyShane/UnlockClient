# Unlock

## A client side library for authenticating with Unlock
This is a library to include in your frontend which will open a WebSocket connection to your Unlock enabled server and get you up and running with simple, socket-based, passwordless authentication.

It handles state management, UI, and allows users to sign up for Unlock directly from your site.

If you haven't set up your server for Unlock yet, check out [the website](https://www.unlock-auth.com/documentation) for more information and documentation.

[![Build Status](https://travis-ci.org/GuyShane/UnlockClient.svg?branch=master)](https://travis-ci.org/GuyShane/UnlockClient)

### Installing
Download [unlock.css](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/dist/unlock.css) and [unlock.js](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/dist/unlock.js), then include them in the relevant places
```html
...
<link rel="stylesheet" href="unlock.css" />
...
<script type="text/javascript" src="unlock.js"></script>
...
```

Unlock is also available via npm:

`npm install unlock-client`

### Usage
This library exports an object, Unlock, to the global space which you interact with to create connections. The object has a single function `init` that you call with an options object to specify its behaviour.

You need to include an input element for the user's email address, as well as a div with the id `unlock-button` where you would like the button to appear. The input and button do not need to appear together. You should only include one instance of Unlock on a page.
```html
...
<div>
    <input type="email" id="email" />
    <div id="unlock-button"></div>
</div>
...
<script>
Unlock.init({
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
| url | string | **required** | - | The url for the socket to connect to. This is the url of your WebSocket server which communicates with Unlock. |
| email | string | **required** | - | The id of the input element where the user enters their email address. Should contain a leading hash. For example: '#email' |
| onMessage | function | **required** | - | A function to be called when the socket receices data. The function is passed one argument: `onMessage(data)` It is the data that was sent through the socket. If the data was JSON, Unlock will parse it first and onMessage will be called with the object, otherwise onMessage will be called with whatever was sent. Typical actions would be storing an authentication cookie and refreshing/redirecting, or handling any errors that occurred. You can then decide whether or not you'd like to close the socket connection from either end. |
| submitOnEnter | boolean | optional | false | Set this to true if you would like users to be able to submit Unlock requests by pressing enter in the input specified by `email` |
| whatsThis | boolean | optional | false | If this is true, it will add a link to [Unlock](https://www.unlock-auth.com) to give new users a way to get acquainted with the system |
| color | string | optional | '#2f81c6' | The background color of the button. Unlock will also automatically set the :hover and :active states to be lighter and darker than the specified color, respectively. Accepted inputs are hex (3 or 6 characters), and rgb() |
| extra | object | optional | - | An object containing extra data to be sent through the socket. Sent to the server as `extra` along with the required `type` and `email` |

### Compatibility
This library uses some modern features that browsers like IE11 don't support:
- [fetch](https://caniuse.com/#feat=fetch)
- [async/await](https://caniuse.com/#feat=async-functions)
- [WebSockets](https://caniuse.com/#feat=websockets)

I would be happy to review pull requests to increase compatibility or start another repo for legacy browsers.

### Running tests
Clone the repo and run
```
npm install
npm test
```
This will start an echo WebSocket server on localhost:3456 and stop it once the tests are finished

### License
[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2019 Shane Brass
