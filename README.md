# Unlock

## A client side library for authenticating with Unlock
This is a library to include in your frontend which will open a WebSocket connection to your Unlock enabled server and get you up and running with simple, socket-based authentication. If you haven't set up your server for Unlock yet, check out [the website](https://www.unlock-auth.com/documentation) for more information and documentation.

### Installing
Download [unlock.css](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/unlock.css) and [unlock.js](https://raw.githubusercontent.com/GuyShane/UnlockClient/master/unlock.js) and include them in your webpage, then include them in the relevant places
```html
...
<link rel="stylesheet" href="unlock.css" />
...
<script type="text/javascript" src="unlock.js"></script>
...
```

### Usage
This library exports a class, Unlock, which you interact with to create connections. The class is initialized with an options object to specify its behaviour.
```js
var unlocker=new Unlock({
    url: 'ws://localhost',
    email: 'email',
    onMessage: function(data){
        console.log(data);
    }
});
```
| Name | Type | Attributes | Description |
| ---- | ---- | ---------- | ----------- |
| url | string | required | The url for the socket to connect to. |
| email | string | required | The id of the input element where the user enters their email address. |
| onMessage | function | required | A function to be called when the socket receices data. |
| button | boolean | optional | Whether or not to use the built in button. |
| color | string | optional | The background color of the button. |
| onOpen | function | optional | A function called when the socket connection is open. |
| onClose | function | optional | A function called if/when the socket connection closes. |
