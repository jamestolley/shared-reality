// this will handle all of the sending and receiving
//   of messages for the content.js extension script
//   there are similar scripts for popup and background.

import { userInfo } from "os-browserify";

class ContentMessenger {
  constructor() {
    this.id = 'content'
    
    this.tab_id = 0;
    this.sentMessages = {}; // for storing callbacks by msg.id

    let content_manager = this;

    // setup the message receiver
    chrome.runtime.onMessage.addListener(
      function(msg, sender, callback) {
        if (msg.to === "content") {
          if (msg.title == 'authenticate-user') {
            let id = new Date().getTime() + 'injected';
            console.log('about to send a message from content to injected', msg);
      
            // set the callback, for when the event is triggered in response
            content_manager.sentMessages[id] = function(response) {
              callback(response);
            };

            // fire the event, with the msg attached
            const data = {
              detail: {
                to: 'injected',
                id: id,
                title: 'authenticate-user',
                msg: msg.msg,
              }
            };
            const event = new CustomEvent('shared-reality-message-for-injected', data);
            console.log('The custom event is being fired by the content script');
            let body = document.getElementsByTagName('body')[0];
            body.dispatchEvent(event);
          }
          else {
            console.log('content got a message for itself that it does not know what to do with', msg);
            options.callback({ msg: 'hi from content' });
          }

        }
        else {
          console.log('content got a message for someone else', msg);
        }
      }
    );
    
    // load Moralis if it's not already present
    if (typeof window.Moralis === 'undefined') {
      const msg = {
        from: this.id,
        to: 'background',
        title: 'injection-request',
        msg: '',
        comment: 'This message instructs the background script to inject moralis.js and other scripts into the content script world'
      }

      console.log('about to send message from the content script', msg);
      chrome.runtime.sendMessage(msg, function(response) {
        var lastError = chrome.runtime.lastError;
        if (lastError) {
            console.log(lastError.message);
            return;
        }
  
        if (response.success !== true) {
          console.error('Message ERROR', msg, response);
        }
        else {
          content_manager.tab_id = msg;
          console.log('Message success', msg, response);
        }
      });
    }
  }

  sendMessage(to, title, msg, callback) {
    let msg_json = JSON.stringify(msg);
    console.log(`content.sendMessage passed { to: '${to}', title: '${title}', msg: '${msg_json}' }`);

    let content_manager = this;

    if (typeof msg !== 'object') {
      if (typeof msg !== 'string' && typeof msg !== 'number') {
        throw 'Shared Reality extension messages must be objects, strings, or numbers';
      }
      msg = { msg };
    }
    if (typeof msg.title !== 'undefined') {
      throw 'Shared Reality extension messages must not have "title" properties';
    }
    if (typeof msg.to !== 'undefined') {
      throw 'Shared Reality extension messages must not have "to" properties';
    }

    msg.from = this.id;
    msg.to = to;
    msg.title = title;

    if (to === 'background' || to === 'popup') {
      console.log('about to send a message from the content script', msg);
      chrome.runtime.sendMessage(msg, function(response) {

        // handle any errors
        var lastError = chrome.runtime.lastError;
        if (lastError) {
            console.log(lastError.message);
            return;
        }
  
        if (response.success !== true) {
          console.error('Message ERROR', msg, response);
        }
        else {
          console.log('Message success', msg, response);
        }
  
        // pass along the response and finish
        callback(response);
      });
    }
    else {
      throw `'to' must be either 'background' or 'popup', not "${to}"`;
    }
  }
}

export default ContentMessenger;
