// this will handle all of the sending and receiving
//   of messages for the content.js extension script
//   there are similar scripts for popup and background.

class BackgroundMessenger {
  constructor() {
    this.id = 'background'
    let background_messenger = this;

    // keys are tab.id's and values are user.toJSON() results
    let injected_tabs = {};

    // setup the message receiver
    chrome.runtime.onMessage.addListener(
      async function(msg, sender, callback) {
        if (msg.to === "background") {
          if (msg.title == 'injection-request') {

            if (typeof sender.tab?.id !== 'undefined') {
              if (injected_tabs[sender.tab.id]) {
                callback({
                  success: true,
                  msg: "already injected",
                });
                return;
              }
              chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: [
                  'inject-js/web3.min.js',
                  'inject-js/moralis.js',
                  'inject-js/injected.js'],
                world: "MAIN"
              }, function(results) {
                for (var i = 0; i < results.length; i++) {
                  for (var prop in results[i].result) {
                    console.log('ERROR: result of script injection is not empty: ', prop, results[i].result[prop]);
                  }
                }
              });
        
              injected_tabs[sender.tab.id] = true;
              callback({
                success: true,
                msg: sender.tab.id,
              });
            }
          }
          else if (msg.title == 'authentication') {
            console.log('background has received the authentication message', msg);
            if (msg.from === 'popup') {
              // they are asking for auth info
              let tab_id = msg.msg;
              return;
              callback({
                success: true,
                msg: authentication_statuses[tab_id]
              });
            }
            else {
              return;
              // injected is letting us know about auth status
              if (typeof msg === 'object' && typeof msg.createdAt !== 'undefined') {
                console.log('the user is authenticated', msg);
                authentication_statuses[sender.tab.id] = msg;
              }
              else {
                console.log('the user is not authenticated', msg);
                authentication_statuses[sender.tab.id] = false;
              }
              callback({
                success: true,
                msg: !!authentication_statuses[sender.tab.id],
              });
            }
          }
          else if (msg.title == 'authenticate-user') {
            // popup is asking to authenticate the user
            // we will pass this message to content
            console.log('background passing an auth request to content', msg);
            let tab_id = msg.tab_id;
            let cb = function(response) {
              callback({
                success: response.success,
                msg: response.msg,
              });
            };
            background_messenger.sendMessage('content', msg.title, msg.msg, cb, tab_id);
          }
          else if (msg.title === 'title') {
            console.log('background got a test message for itself that it does understand', msg);
            callback({ success: true, msg: `got ${msg.msg}!!!` })
          }
          else {
            console.log('background got a message for itself', msg);
            callback({ success: false, msg: 'background did not understand that message' })
          }
        }
        else {
          console.log('background got a message for someone else', msg);
        }
      }
    );
  }

  async sendMessage(to, title, msg, callback, tab_id) {

    console.log(`background.sendMessage passed to: '${to}', title: '${title}', msg: '${msg}', tab_id: '${tab_id}'`);
    if (typeof msg !== 'object') {
      if (typeof msg !== 'string' && typeof msg !== 'number') {
        throw `Shared Reality extension messages must be objects, strings, or numbers. Not (${msg})`, typeof msg;
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

      if (!tab_id) {
        let queryOptions = {
          active: true,
          currentWindow: true
        };
        let tabs = await chrome.tabs.query(queryOptions);
        tab_id = tabs[0].id;
      }

      console.log('about to send a message from the background', tab_id, msg);
      chrome.tabs.sendMessage(tab_id, msg, function(response) {
  
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
    else if (to === 'popup') {

      let cb = function(response) {
  
        // handle any errors
        var lastError = chrome.runtime.lastError;
        if (lastError) {
            console.log(lastError.message);
            return;
        }
  
        // pass along the response and finish
        callback(response);
      };

      let options = {
        callback: cb
      };

      console.log('about to send a message from the background', msg, options);
      chrome.runtime.sendMessage(msg, options);
    }
    else {
      throw `'to' must be either 'content' or 'popup', not "${to}"`;
    }
  }
}

export default BackgroundMessenger;
