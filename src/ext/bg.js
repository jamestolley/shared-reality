import 'regenerator-runtime/runtime'
import BackgroundMessenger from '../components/ext-messaging/BackgroundMessenger'

/**
 * Set up messaging between different extension worlds
 */
const messenger = new BackgroundMessenger();

console.log("This is the background page.");
/**
 * END: Set up messaging between different extension worlds
 */

/**
 * Set up and handle the context menu item
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "id": "SharedRealityContextMenuItem",
    "title": "Connect the selected text to Shared Reality",
    "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "SharedRealityContextMenuItem") {
    console.log('The custom context menu item was clicked');
    console.log(info, tab);
  }
});
/**
 * END: Set up and handle the context menu item
 */

/**
 * The next thing...
 */
