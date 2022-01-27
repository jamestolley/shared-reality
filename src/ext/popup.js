import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'

import { ChakraProvider } from '@chakra-ui/react'
import theme from '../components/SRTheme'
import Popup from '../components/Popup';
import PopupMessenger from '../components/ext-messaging/PopupMessenger'
import messenger from '../components/ext-messaging/messenger'

let popup_ref = React.createRef();

window.messenger = new PopupMessenger(popup_ref);

let user = messenger.user;

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Popup ref={popup_ref} user={user}/>
  </ChakraProvider>,
  document.getElementById('root')
)

window.onload = function() {

  /**
   * Initiate the auth-user process to log in the user
   */
  let button2 = document.getElementById('popup-authentication-info-button');
  button2.addEventListener('click', async function(e) {
    window.messenger.getUserInfo();
    /*
    console.log('clicked', e);
    let to = window.to || 'content';
    let title = window.title || 'auth-info';
    let msg = {
      tab_id: messenger.tab_id,
      msg: window.msg || 'info', // 'login' is the other possibility
    };
    let cb = window.cb || function(user) {
      console.log('this is the requested user data', user);
      messenger.setUser(user);
    };
    console.log('sending authentication request message from popup', to, title, msg, cb);
    messenger.sendMessage(to, title, msg, cb);
    */
  })

  /**
   * Initiate the auth-info process to get information about the user (if any)
   */
  let button = document.getElementById('popup-authenticate-button');
  button.addEventListener('click', async function(e) {
    window.messenger.authenticateUser();
    /*
    console.log('clicked', e);
    let to = window.to || 'background';
    let title = window.title || 'auth-user';
    let msg = {
      tab_id: messenger.tab_id,
      msg: window.msg || 'login', // 'info' is the other possibility
    };
    let cb = window.cb || function(user) {
      console.log('this is the authenticated user data', user);
      messenger.setUser(user);
    };
    console.log('sending authentication request message from popup', to, title, msg, cb);
    messenger.sendMessage(to, title, msg, cb);
    */
  })
}