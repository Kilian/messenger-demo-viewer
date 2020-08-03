const electron = require('electron');
const url = require('url');

const ipc = electron.ipcRenderer;
const shell = electron.shell;
const remote = electron.remote;
const nodeStorage = remote.getGlobal('nodeStorage');

const webview = document.querySelector('#main');
let sidebarState = 'closed';

// open link in browser
webview.addEventListener('new-window', (e) => {
  const protocol = url.parse(e.url).protocol;

  if (protocol === 'http:' || protocol === 'https:') {
    shell.openExternal(e.url);
  }
});

// handle toggling of sidebar
const initial = `
  :root {
     --open: none;
     --closed: block;
     --state: var(--closed);
  }
  ._4sp8 > ._1enh {
    display: var(--state);
    max-height: 100vh;
    overflow: hidden;
    transition: .3s max-width ease;
  }`;

const open = ':root { --state: var(--open); }';
const closed = ':root { --state: var(--closed); }';

webview.addEventListener('did-finish-load', () => {
  webview.insertCSS(initial);
});

const toggleSidebar = () => {
  if (sidebarState === 'closed') {
    webview.insertCSS(open);
    sidebarState = 'open';
  } else {
    webview.insertCSS(closed);
    sidebarState = 'closed';
  }
};

const showUpdateMessage = () => {
  const hideMessageFor = nodeStorage.getItem('hideUpdateMessage');
  const hideVersion = hideMessageFor ? hideMessageFor.version : false;
  const latestVersion = remote.getGlobal('latestVersion');

  if (latestVersion !== hideVersion) {
    const updater = document.querySelector('.updater');
    const hideme = document.querySelector('.updater .hideme');
    const version = document.querySelector('.updater .version');

    version.innerText = latestVersion;
    updater.classList.add('active');

    hideme.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nodeStorage.setItem('hideUpdateMessage', { version: latestVersion });
      updater.classList.remove('active');
    });

    updater.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      shell.openExternal('https://messenger-demo-viewer.kilianvalkhof.com');
      updater.classList.remove('active');
    });
  }
};

// get events
ipc.on('executeShortCut', (e, shortcut) => {
  switch (shortcut) {
    case 'toggle-sidebar':
      toggleSidebar();
      break;
    case 'show-update-msg':
      showUpdateMessage();
      break;
    default:
      break;
  }
});
