import 'regenerator-runtime/runtime'

import css from './content.css'
import ContentMessenger from '../components/ext-messaging/ContentMessenger'

let messenger = new ContentMessenger();

/*
let cb = (e) => {
	let msg = e.detail;
	console.log('The custom event was received by the content script', msg);
	if (msg.to === 'content') {
		if (msg.title === 'authenticate-user') {
			// this is the response from the previous request
			console.log('The content script is processing the response to the auth request', msg);
			if (typeof messenger.sentMessages[msg.id] === 'function') {
				console.log('The content script is going to run the callback', msg);
				messenger.sentMessages[msg.id](msg.msg); // ??
				delete messenger.sentMessages[msg.id];
				messenger.sendMessage('popup', 'authenticate-user', msg.msg, () => {});
			}
		}
		else {
			console.error('the content script got a message sent to it that it does not know what to do with', msg);
		}
	}
	else if (typeof msg.id !== 'undefined') {
		// this is a response to a previous message from injected
		console.log('the content script got a message that it will forward', msg);
		messenger.sendMessage(msg.to, msg.title, msg.value, (response) => {
			console.log('the content script got a response to the forwarded message', msg, response);
			
			const data = {
				detail: {
					to: 'injected',
					id: msg.id,
					response: response
				}
			};
			const event = new CustomEvent('shared-reality-message-for-injected', data);
			console.log('The custom event is being fired by the content script');
			let body = document.getElementsByTagName('body')[0];
			body.dispatchEvent(event);
	
		});
	}
	else if (typeof messenger.sentMessages[msg.id] === 'function') {
		// finally, run the associated callback
		console.log('the content script received the message from injected and will run the callback', msg);
		messenger.sentMessages[msg.id](msg.msg);
	}
}
let event_name = 'shared-reality-message-for-content';
let body = document.getElementsByTagName('body')[0];
body.addEventListener(event_name, cb);
*/