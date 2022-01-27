import BaseMessenger from './BaseMessenger';

/**
 * Class for handling messages for the popup script
 */

class BackgroundMessenger extends BaseMessenger {
  constructor() {
    super('background');

    this.injectedTabs = {};

    this.setupListeners();
  }

  /**
   * Setup the onMessage listeners for the background
   */
  setupListeners() {

    let background_messenger = this;

    chrome.runtime.onMessage.addListener(
      async function(message_data, sender, callback) {
        if (message_data.to !== "background") {
          return;
        }

        /**
         * Check the message title to know what kind of message this is
         */
        if (message_data.title == 'injection-request') {

          if (typeof sender.tab?.id !== 'undefined') {

            /**
             * If this script has already been injected in the last second, just return
             */
            if (typeof background_messenger.injectedTabs[sender.tab.id] !== 'undefined') {
              let now = new Date().getTime();
              if (now - background_messenger.injectedTabs[sender.tab.id] < 1000) {
                return;
              }
            }
            background_messenger.injectedTabs[sender.tab.id] = new Date().getTime();

            console.log('background: injecting scripts as requested', message_data, sender);

            chrome.scripting.executeScript({
              target: { tabId: sender.tab.id },
              files: [
                'inject-js/web3.min.js',
                'inject-js/moralis.js',
                'inject-js/InjectedMessenger.js',
                'inject-js/injected.js'
              ],
              world: "MAIN"
            }, function(results) {
              for (var i = 0; i < results.length; i++) {
                for (var prop in results[i].result) {
                  console.error('background: script injection resulted in an error: ', prop, results[i].result[prop]);
                }
              }
            });
      
            callback({
              success: true,
              msg: '[not needed]'
            });
          }
        }
        /*
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
        */
        else {
          console.error('background: unknown message', message_data);
          callback({ success: false, msg: 'background did not understand that message' });
        }
      }
    );

  }

}

export default BackgroundMessenger;
