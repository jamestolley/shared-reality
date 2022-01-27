/**
 * Base class for sending messages between parts of the browser extension
 */

 class BaseMessenger {
  constructor(id) {

    if (!['injected', 'content', 'popup', 'background'].includes(id)) {
      console.error(`id must be one of [injected, content, popup, background], not: ${id}`);
      return;
    }

    this.id = id;

    this.setupListeners();
  }

  /**
   * Fail if the child class has not overridden this method
   */
  setupListeners() {
    console.error('setupListeners needs to be overridden');
  }


  /**
   * Delegates messages to the other send methods
   */
  sendMessage(message_data) { // (to, title, msg, callback)

    /**
     * Sanity check the message_data
     */
    console.log(`BaseMessenger.sendMessage received '${message_data.title}'`, message_data);
 
    if (typeof message_data !== 'object') {
      throw `Shared Reality extension messages must be objects, not '${typeof message_data}'`;
    }
    for (let prop of ['title','from','to','msg']) {
      if (typeof message_data[prop] === 'undefined' || !message_data[prop]) {
        throw `Shared Reality extension messages must have a "${prop}" property and it must evaluate to true, not '${message_data[prop]}'`;
      }
    }
    if (message_data.callback && typeof message_data.callback !== 'function') {
      throw `If Shared Reality extension messages have callback properties, they must be functions, not '${typeof message_data.callback}'`;
    }

    
    /**
     * The message has passed the sanity checks.
     * Send the message to its appropriate handler method.
     */
    if (message_data.from == 'injected' || message_data.to == 'injected') {

      this._sendEventMessage(message_data);

    }
    else {

      this._sendApiMessage(message_data);

    }

  }

  /**
   * This will send a message to the MAIN world
   * from the content script
   */
  _sendEventMessage(message_data) {

    const event_data = {
      detail: {
        to: (this.id === 'content' ? 'injected' : 'content'),
        id: message_data.id,
        msg: message_data
      }
    };

    const event = new CustomEvent(`shared-reality-message-for-${event_data.detail.to}`, event_data);
    console.log(`${this.id}: forwarding a message`, message_data, event_data);
    let body = document.getElementsByTagName('body')[0];
    body.dispatchEvent(event);

  }

  /**
   * This will send a message between popup,
   * background, and content.
   */
   _sendApiMessage(message_data) {

    if (message_data.to === 'content' || message_data.to === 'popup') {
      this._sendTabMessage(message_data);
    }
    else {
      this._sendRuntimeMessage(message_data);
    }

  }

  /**
   * This will send a message using chrome.tabs.sendMessage()
   */
  async _sendTabMessage(message_data) {

    let tab_id = await this.getTabId();

    console.log(`${this.id}: sending tab message`, tab_id, message_data);
    chrome.tabs.sendMessage(tab_id, message_data, function(response) {

      /**
       * Report any delivery errors
       */
      var lastError = chrome.runtime.lastError;
      if (lastError) {
          console.log(`runtime.lastError: '${lastError.message}'`, message_data);
          return;
      }

      /**
       * Pass along the response and finish
       */
      if (typeof message_data.callback === 'function') {
        message_data.callback(response);
      }

    });

  }
  
  /**
   * This will send a message using chrome.runtime.sendMessage()
   */
  _sendRuntimeMessage(message_data) {

    console.log(`${this.id}: sending a runtime message`, message_data);
    chrome.runtime.sendMessage(message_data, function(response) {

      /**
       * Report any delivery errors
       */
      var lastError = chrome.runtime.lastError;
      if (lastError) {
          console.log(`runtime.lastError: '${lastError.message}'`, message_data);
          return;
      }

      /**
       * Pass along the response and finish
       */
      if (typeof message_data.callback === 'function') {
        message_data.callback(response);
      }

    });

  }
  
  async getTabId() {

    if (this.id === 'injected' || this.id === 'content') {
      console.error('getTabId is not intended to be called from the injected script or the content script');
      return;
    }

    let queryOptions = {
      active: true,
      currentWindow: true
    };

    let tabs = await chrome.tabs.query(queryOptions);

    return tabs[0].id;
  }
}



/**
 * Class for handling messages for the popup script
 */

class InjectedMessenger extends BaseMessenger {
  constructor() {
    super('injected');

    /**
     * Keep track of callbacks which we will fire after
     * we get our responses from the extension
     */
    this.callbacksForSentMessages = {};

  }

  /**
   * Create the event listener
   */
  setupListeners() {

    let injected_messenger = this;

    /**
     * Define the handler for incoming custom message events
     */
    let injected_script_event_callback = (event) => {
      let message_data = event.detail;
      console.log('injected: received a message', message_data);
    
      /**
       * Only respond to messages intended for us
       */
      if (message_data.to !== 'injected') {
        return;
      }

      /**
       * If there is a callback registered for this message id, run it and return
       */
      if (typeof injected_messenger.callbacksForSentMessages[message_data.id] === 'function') {
        console.log('injected: running the callback function', message_data);
        injected_messenger.callbacksForSentMessages[message_data.id](message_data.response);
        delete injected_messenger.callbacksForSentMessages;
        return;
      }

      /**
       * Check the title to see what kind of message this is
       */

      /**
       * Popup is requesting auth info for the current user
       */
      if (message_data.title === 'auth-info') {
  
        let user = Moralis.User.current();

        let user_to_send = user?.createdAt ? user.toJSON() : false;
  
        let response_data = {
          detail: {
            success: true,
            id: message_data.id,
            to: 'content',
            title: 'auth-info',
            msg: user_to_send,
          },
        };
  
        console.log('injected: responding to auth-info', message_data, response_data);

        const event = new CustomEvent('shared-reality-message-for-content', response_data);
        let body = document.getElementsByTagName('body')[0];
        body.dispatchEvent(event);
        return;
      }

      /**
       * The popup is asking us to authenticate the user with MetaMask
       */
      if (message_data.title === 'auth-user') {
        console.log('injected: has received an auth-user request', message_data);

        let user = Moralis.User.current();

        if (user?.createdAt) {

          /**
           * The user is already logged in.
           * Return the user information.
           */
          let response_data = {
            detail: {
              success: true,
              id: message_data.id,
              to: 'content',
              title: 'auth-user',
              msg: user.toJSON(),
            }
          };
  
          const custom_event = new CustomEvent('shared-reality-message-for-content', response_data);
          console.log('injected: responding to auth-user request for already-logged-in user', response_data);
          let body = document.getElementsByTagName('body')[0];
          body.dispatchEvent(custom_event);
          return;

        }

        else {

          /**
           * The user is not logged in.
           * Log them in and return their data.
           */
          Moralis.authenticate().then((user) => {
  
            let response_data = {
              detail: {
                success: true,
                id: message_data.id,
                to: 'content',
                title: 'auth-user',
                msg: user.toJSON(),
              }
            };
  
            const event = new CustomEvent('shared-reality-message-for-content', response_data);
            console.log('injected: responding to auth-user request after logging in the user', response_data);
            let body = document.getElementsByTagName('body')[0];
            body.dispatchEvent(event);
                  
          }).catch(() => {
  
            let response_data = {
              detail: {
                success: true,
                id: message_data.id,
                to: 'content',
                title: 'auth-user',
                msg: false
              }
            };
  
            const event = new CustomEvent('shared-reality-message-for-content', response_data);
            console.log('injected: responding to auth-user request after logging in the user', response_data);
            let body = document.getElementsByTagName('body')[0];
            body.dispatchEvent(event);

          });
        }
      }
      else {
        console.error(`injected: unknown message title: '${message_data.title}'`, message_data);
      }
    }

    /**
     * Setup the event listener
     */
    let event_name = 'shared-reality-message-for-injected';
    let body = document.getElementsByTagName('body')[0];
    body.addEventListener(event_name, injected_script_event_callback);

  }

}
