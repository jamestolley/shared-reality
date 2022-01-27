import BaseMessenger from './BaseMessenger';

/**
 * Class for handling messages for the popup script
 */

class ContentMessenger extends BaseMessenger {
  constructor() {
    super('content');

    /**
     * Keep track of callbacks which we will fire after
     * we get our responses from the extension
     */
    this.callbacksForSentMessages = {};

    this.requestScriptInjection();
  }

  requestScriptInjection() {

    console.log('requestScriptInjection has been called');

    /**
     * Ask the background script to inject the injection script
     * and related scripts into the MAIN world.
     */  
    const message_data = {
      title: 'injection-request',
      from: this.id,
      to: 'background',
      msg: '[not needed]'
    }

    chrome.runtime.sendMessage(message_data, function(response) {

      var lastError = chrome.runtime.lastError;
      if (lastError) {
          console.error(`content: the injection-request message resulted in a runtime error: '${lastError.message}'`);
          return;
      }

      if (response.success !== true) {
        console.error(`content: the injection-request message resulted in an error:`, message_data, response);
      }
      else {
        console.log(`content: the injection-request message resulted in success:`, message_data, response);
      }
    });

  }

  /**
   * Create the event listener
   */
  setupListeners() {

    let content_messenger = this;

    /**
     * Setup the listeners for messages sent from the popup and background scripts
     */
    chrome.runtime.onMessage.addListener((message_data, sender, callback)  => {

        /**
         * Only respond to messages intended for us
         */
        if (message_data.to === "content") {

          console.log(`content: received the ${message_data.title} message`, message_data);

          /**
           * Handle auth-user (requests to log in the user)
           * and auth-info (requests for information about the current user) requests
           */
          if (message_data.title == 'auth-user' || message_data.title == 'auth-info') {

            /**
             * Create an id and set the callback which will be
             * run when the response is received.
             */
            let id = new Date().getTime() + 'injected';
            content_messenger.callbacksForSentMessages[id] = function(response) {
              callback(response);
            };

            /**
             * Format the data for the inject script.
             */
            const custom_event_data = {
              detail: {
                to: 'injected',
                from: 'content',
                id: id,
                title: message_data.title,
                msg: message_data.msg,
              }
            };

            /**
             * Fire a custom event to pass the message.
             */
            const custom_event = new CustomEvent('shared-reality-message-for-injected', custom_event_data);
            console.log(`content: passing an ${message_data.title} request to the injected script`, message_data, custom_event_data);
            let body = document.getElementsByTagName('body')[0];
            body.dispatchEvent(custom_event);
            return;

          }
          else {
            console.log('content: unknown message', message_data);
          }

        }
      }
    );
      
    /**
     * Setup the listeners for messages sent from the injected script
     */
    let content_script_event_callback = (event) => {

      let message_data = event.detail;

      /**
       * Only respond to messages intended for us
       */
      if (message_data.to === 'content') {

        /**
         * Check the title to see what kind of message this is
         */
        if (message_data.title === 'auth-user' || message_data.title === 'auth-info') {

          /**
           * Executing and then delete the callback for the original request
           */
          if (typeof content_messenger.callbacksForSentMessages[message_data.id] === 'function') {
            console.log('content: executing the auth-user or auth-info callback', message_data);
            content_messenger.callbacksForSentMessages[message_data.id](message_data.msg);
            delete content_messenger.callbacksForSentMessages[message_data.id];
          }

          /**
           * Since that callback is not reliable (because it takes so long...?)
           * I'll send another message to popup with the user info
           */
          content_messenger.sendMessage({
            title: 'auth-info',
            from: 'content',
            to: 'popup',
            msg: message_data.msg // this is the user data or false if there is no authenticated user
          });

        }
      }
    }

    /**
     * Install the listener for the custom message events
     */
    let event_name = 'shared-reality-message-for-content';
    let body = document.getElementsByTagName('body')[0];
    body.addEventListener(event_name, content_script_event_callback);

  }

}

export default ContentMessenger;
