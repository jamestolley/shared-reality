

// pass in the id for the current script
const Messenger = (self) => {

  if (!['injected', 'content', 'popup', 'background'].includes(self)) {
    console.error(`messenger param must be one of [injected, content, popup, background], not: ${self}`);
  }

  this.self = self;

  /**
   * This will map message ids to callbacks
   * which will be run when the responses
   * to those messages are received.
   */
  this.callbacksForSentMessages = {};

  this.setupListeners();

};

Messenger.prototype.setupListeners = () => {

  let messenger = this;

  /**
   * Setup the listeners for the popup script
   */
  if (this.self == 'popup') {

  }

  /**
   * Setup the listeners for the background script
   */
  else if (this.self == 'background') {

    chrome.runtime.onMessage.addListener(
      async function(message_data, sender, callback) {

        /**
         * Only respond to messages meant for us
         */
        if (message_data.to === "background") {

          /**
           * The content script is requesting scripts
           * be injected into the MAIN world.
           */
          if (message_data.title == 'injection-request') {

            if (typeof sender.tab?.id !== 'undefined') {
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
                msg: 'the scripts have been injected' // sender.tab.id,
              });
            }
            else {
              console.error(`background received an injection-request but no sender.tab.id`, message_data, sender, callback);
              return;
            }
          }
          else if (message_data.title == 'auth-info') {

            /**
             * Forwarding messages about user information
             * between popup and content.
             */
            if (message_data.from === 'popup') {

              /**
               * Popup is asking for information about the current user.
               * We will forward the message to content.
               */

              //console.log('background: forwarding auth-info message', message_data);
            }
            else if (message_data.from === 'content') {

              /**
               * Content is responding with information about the current user.
               * We will forward the message to popup.
               */

              //console.log('background: forwarding auth-info message', message_data);
            }
          }
          else if (message_data.title == 'auth-user') {

            /**
             * Forwarding messages about a user authentication
             * request between popup and content.
             */
            if (message_data.from === 'popup') {

              /**
               * Popup is asking for injected to authenticate the user.
               * We will forward the message to content.
               */

              //console.log('background: forwarding auth-info message', message_data);
            }
            else if (message_data.from === 'content') {

              /**
               * Content is responding to popup's request for the user to be authenticated.
               * We will forward the message to popup.
               */

              //console.log('background: forwarding auth-info message', message_data);
            }
          }
          else if (message_data.title === 'test-message') {
            console.log('background: got the test message', message_data);
            callback({ success: true, msg: `${message_data.title} received by background` })
          }
          else {
            console.log('background: unknown message', message_data);
            callback({ success: false, msg: 'unknown message' });
          }
        }
        else {
          console.log('background got a message for someone else', message_data);
        }
      }
    );    

  }

  /**
   * Setup the listeners for the content script
   */
  else if (this.self == 'content') {
  }

  /**
   * Setup the listeners for the injected script
   */
  else {

  }
};

Messenger.prototype.sendMessage = function(message_data) {
  if (this.self == 'popup') {

  }
  else if (this.self == 'background') {

  }
  else if (this.self == 'content') {

  }
  else { // injected

  }

};

Messenger.prototype.sendTestMessageFromPopupToInjected = function() {
  if (this.self !== 'popup') {
    console.error('sendTestMessageFromPopupToInjected called from other than popup, which is not allowed');
    return;
  }

};

Messenger.prototype.sendTestMessageFromInjectedToPopup = function() {
  if (this.self !== 'injected') {
    console.error('sendTestMessageFromInjectedToPopup called from other than injected, which is not allowed');
    return;
  }

};


exports.default = Messenger;