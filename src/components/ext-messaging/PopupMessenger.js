import BaseMessenger from './BaseMessenger';

/**
 * Class for handling messages for the popup script
 */

class PopupMessenger extends BaseMessenger {
  constructor() {
    super('popup');
  }

  /**
   * Get information about the current user
   * Returns either information about the user, or false
   */
  async getUserInfo(callback) {

    let callback_to_use = typeof callback === 'function' ? callback : (response) => {
      console.log(`popup: received getUserInfo response`, message_data, response);
    };

    let message_data = {
      title: 'auth-info',
      to: 'content',
      from: this.id,
      msg: '[not used but must be true]',
      callback: callback_to_use
    };
    this.sendMessage(message_data);
  }

  /**
   * Request that the user be authenticated
   * Returns either information about the user, or false
   */
   async authenticateUser(callback) {

    let callback_to_use = typeof callback === 'function' ? callback : (response) => {
      console.log(`popup: received authenticateUser response`, message_data, response);
    };

    let message_data = {
      title: 'auth-user',
      to: 'content',
      from: this.id,
      msg: '[not used but must be true]',
      callback: callback_to_use
    };
    this.sendMessage(message_data);
  }

  /**
   * Setup the onMessage listeners for the popup
   */
  setupListeners() {

    let popup_messenger = this;
    
    chrome.runtime.onMessage.addListener(
      function(message_data, sender, callback) {
        if (message_data.to !== "popup") {
          return;
        }

        if (message_data.title === 'test-message') {
          console.log('popup: responding to test message', message_data);
          callback({ success: true, msg: `${message_data.title} received` });
        }
        else if (message_data.title === 'auth-info') {
          /**
           * This is info about the current user
           */
          console.log("popup: received 'auth-info' message", message_data);
          popup_messenger.user = message_data.msg;
          callback({ success: true, msg: 'auth status acknowledged' });
        }
        /*
        else if (msg.title === 'auth-user') {
          // this is a response tp a previous request
          console.log('popup got the auth request response', message_data);
          popup_messenger.user = message_data.msg;
          callback({ success: true, msg: `auth response received` });
        }
        */
        else {
          console.error(`popup: unknown title '${message_data.title}'`, message_data);
          callback({ success: false, msg: `popup: unknown message ${message_data.title}`, orig_msg: message_data });
        }

      }
    );

  }

}

export default PopupMessenger;
