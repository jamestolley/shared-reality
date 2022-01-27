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
      if (typeof message_data[prop] === 'undefined') {
        throw `Shared Reality extension messages must have a "${prop}" property`;
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

    if (message_data.to === 'content' || (message_data.to === 'popup' && message_data.from === 'background')) {
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

export default BaseMessenger;
