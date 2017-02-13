const electron = require('electron');
const url = require('url');

const ipc = electron.ipcRenderer;
const shell = electron.shell;

const webview = document.querySelector('#main');

webview.addEventListener('new-window', (e) => {
  const protocol = url.parse(e.url).protocol;

  if (protocol === 'http:' || protocol === 'https:') {
    shell.openExternal(e.url);
  }
});

const initial = `
  :root {
     --open: 420px;
     --closed: 0px;
     --state: var(--closed);
  }
  ._4sp8._li > ._1enh {
    max-width: var(--state);
    min-width: 0px;
    max-height: 100vh;
    overflow: hidden;
    transition: .3s max-width ease;
  }`;

const open = ':root { --state: var(--open); }';
const closed = ':root { --state: var(--closed); }';


webview.addEventListener('did-finish-load', () => {
  webview.insertCSS(initial);
});

let state = 'closed';

ipc.on('executeShortCut', (e, shortcut) => {
  switch (shortcut) {
    case 'toggle-sidebar':
      if (state === 'closed') {
        webview.insertCSS(open);
        state = 'open';
      } else {
        webview.insertCSS(closed);
        state = 'closed';
      }
      break;
    default:
      break;
  }
});
