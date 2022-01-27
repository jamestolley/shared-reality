
/**
 * This script gets injected into the page context
 * along with the Moralis API
 * 
 * Start by setting up the messaging system
 */
/*
window.SharedReality = {
  user: false,
  informPopupOfAuthStatus: () => {
    let user_info = SharedReality.user?.toJSON ? SharedReality.user.toJSON() : '';
    SharedReality.sendMessage('popup','authentication',user_info,(msg) => {
      console.log('popup acknowledged the auth status message', msg);
    })
  },
  sentMessages: {},
  sendMessage(to, title, value, callback) {

    if (typeof to !== 'string' || !['content','popup','background'].includes(to)) {
      console.error('in sendMessage: `to` must be a string and must be one of (content, popup, background)', to);
    }
    if (typeof value !== 'string' && typeof value !== 'object') {
      console.error('in sendMessage: `value` must be a string or an object', value);
    }
    if (typeof callback !== 'function') {
      console.error('in sendMessage: `callback` must be a function', valuecallback);
    }
  
    let datetime = new Date().getTime();
    let id = `${datetime}${to}`;

    window.SharedReality.sentMessages[id] = callback;

    const msg = { id, to, title, value };

    const event = new CustomEvent('shared-reality-message-for-content', { detail: msg });
    console.log('The custom event is being fired by the injected script');
    let body = document.getElementsByTagName('body')[0];
    body.dispatchEvent(event);
  }
};
*/
/**
 * Listen for and handle Shared Reality messages
 */
/*
let body = document.getElementsByTagName('body')[0];

// the handler for incoming callbacks for fired events
let cb = (e) => {
	let msg = e.detail;
	console.log('The custom event was received by the injected script', msg);

  // we are only interested in messages which are sent to 'injected'
  if (msg.to === 'injected') {
    // run the callback, if one exists for this id
    if (typeof window.SharedReality.sentMessages[msg.id] === 'function') {
      console.log('the injected script got a message sent to it that it knows what to do with', msg);
      window.SharedReality.sentMessages[msg.id](msg.response);
    }
    // if there is not callback for the msg.id, then this is an original call
    else if (msg.title === 'authenticate-user' || msg.title === 'authentication') {
      // the popup script wants us to try to authenticate the user

      let user = Moralis.User.current();
      if (msg.msg === 'info') {
        // just send back the infomation about the current user
        console.log('the injected script has been asked for info about the current user', msg);

        let user_to_send = user?.createdAt ? user.toJSON() : {};

        let data = {
          detail: {
            success: true,
            id: msg.id,
            to: 'content',
            title: 'authentication',
            msg: user_to_send,
            value: user_to_send,
          },
        };

        const event = new CustomEvent('shared-reality-message-for-content', data);
        console.log('The injected script is sending back info about the current user');
        let body = document.getElementsByTagName('body')[0];
        body.dispatchEvent(event);
      }
      else { // try to log them in
        console.log('the injected script has been asked to authenticate the user', msg);
        if (!user?.createdAt) {
          Moralis.authenticate().then((user) => {
            let details = {
              success: true,
              id: msg.id,
              to: 'content',
              title: 'authenticate-user',
              msg: user.toJSON(),
              value: user.toJSON(),
            };
  
            let data = {
              detail: details
            };
  
            const event = new CustomEvent('shared-reality-message-for-content', data);
            console.log('The injected script is sending back the auth request response');
            let body = document.getElementsByTagName('body')[0];
            body.dispatchEvent(event);
                  
          });
        }
        else {
          // the user is already authenticated,
          // just return the user info
          let details = {
            success: true,
            id: msg.id,
            to: 'content',
            title: 'authenticate-user',
            msg: user.toJSON(),
            value: user.toJSON(),
          };
  
          let data = {
            detail: details
          };
  
          const event = new CustomEvent('shared-reality-message-for-content', data);
          console.log('The injected script is sending back the auth request response');
          let body = document.getElementsByTagName('body')[0];
          body.dispatchEvent(event);
        }
      }
    }
    else {
      console.error('the injected script got a message sent to it that it does not know what to do with', msg);
    }
	}
	else {
		console.error('the injected script got a message meant for someone else (should never happen', msg);
	}
}
let event_name = 'shared-reality-message-for-injected';
body.addEventListener(event_name, cb);
*/

/**
 * END: Listen for and handle Shared Reality messages
 */

//alert('BaseMessenger: ' + BaseMessenger);

window.InjectedMessenger = new InjectedMessenger();

if (typeof window.ethereum != 'undefined') {
  const serverUrl = "https://bdadpk97k92l.usemoralis.com:2053/server";
  const appId = "EdHexSHSSul3zTSkNECq5eJQZyl7l5szTupRArw0";
  Moralis.start({ serverUrl, appId });

  async function loadData() {
    const InboxChangedMessages = Moralis.Object.extend("InboxChangedMessages");
    const query = new Moralis.Query(InboxChangedMessages);
    const results = await query.find();
    console.log("Successfully retrieved " + results.length + " InboxChangedMessages.");
    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      console.log(object.id + ' - ' + object.get('newMessage'));
    }
  }

  loadData();

  /**
   * Check the auth status, and let the background script know.
   * This is helpful because the user might become authorized
   * a few seconds after this code runs.
   */
/*
  let iId = setInterval(() => {
      let user = Moralis.User.current();
      if (!!user !== !!SharedReality.user) {
        SharedReality.user = user ? user : false;
        SharedReality.informPopupOfAuthStatus();
      }
    }, 1000);
*/

}

