// this will handle all of the sending and receiving
//   of messages for the content.js extension script
//   there are similar scripts for popup and background.

class PopupMessenger {
  constructor(popup_ref) {
    this.id = 'popup'

    this.popup_ref = popup_ref;
    this.tab_id = 0;
    this.user = null;
    let popup_messenger = this;

    // setup the message receiver
    chrome.runtime.onMessage.addListener(
      function(msg, sender, callback) {
        if (msg.to === "popup") {
          if (msg.title === 'title') {
            console.log('popup got a test message for itself that it does understand', msg);
            callback({ success: true, msg: `got ${msg.msg}!!!` })
          }
          else if (msg.title === 'authentication') {
            // this is info about auth status from injected
            console.log('popup got the auth status', msg);
            popup_messenger.user = msg.msg;
            callback({ success: true, msg: 'auth status acknowledged' });
          }
          else if (msg.title === 'authenticate-user') {
            // this is a response tp a previous request
            console.log('popup got the auth request response', msg);
            popup_messenger.user = msg.msg;
            callback({ success: true, msg: `auth response received` });
          }
          else {
            console.log('popup got a message for itself that it did not understand', msg);
            callback({ success: false, msg: 'popup did not understand that message' })
          }
        }
        else {
          console.log('popup got a message for someone else', msg);
        }
      }
    );

    let getTab = async () => {
      let queryOptions = {
        active: true,
        currentWindow: true
      };
      let tabs = await chrome.tabs.query(queryOptions);
      console.log('popup tried to get its own tab', tabs[0]);
      popup_messenger.tab_id = tabs[0].id;
      return popup_messenger.tab_id;
    };

    getTab().then((tabid) => {
      console.log('tabid', tabid);
    });

    // get the user, if there is one
    const msg = {
      from: this.id,
      to: 'background',
      title: 'authentication',
      msg: popup_messenger.tab_id || '',
      comment: 'This message requests the user'
    }

    console.log('about to send message from the popup script', msg);
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
        if (response.msg) {
          popup_messenger.user = response.msg;
          console.log('The user is authenticated', response.msg);
        }
        else {
          console.log('The user is not authenticated');
        }
      }
    });
  }

  setUser(user_info) {
    this.user = user_info;
    this.popup_ref.current.setUser(user_info);
  }

  async sendMessage(to, title, msg, callback) {
    let msg_json = JSON.stringify(msg);
    console.log(`popup.sendMessage passed { to: '${to}', title: '${title}', msg: '${msg_json}' }`);

    if (typeof msg !== 'object') {
      if (typeof msg !== 'string' && typeof msg !== 'number') {
        throw `Shared Reality extension messages must be objects, strings, or numbers. Not (${msg}): ` + typeof msg;
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

    if (to === 'content') {

      let queryOptions = {
        active: true,
        currentWindow: true
      };
      let tabs = await chrome.tabs.query(queryOptions);

      console.log('popup: sending message to content', tabs[0], msg);
      chrome.tabs.sendMessage(tabs[0].id, msg, {}, function(response) {
  
        // handle any errors
        var lastError = chrome.runtime.lastError;
        if (lastError) {
            console.log(lastError.message);
            return;
        }
  
        // pass along the response and finish
        callback(response);
      });
    }
    else if (to === 'background') {

      console.log('about to send a message from the popup', msg);
      chrome.runtime.sendMessage(msg, function(response) {
  
        // handle any errors
        var lastError = chrome.runtime.lastError;
        if (lastError) {
            console.log(lastError.message);
            return;
        }
  
        // pass along the response and finish
        callback(response);
      });
    }
    else {
      throw `'to' must be either 'content' or 'background', not "${to}"`;
    }
  }
}

export default PopupMessenger;
