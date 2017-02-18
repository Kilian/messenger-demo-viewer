const electron = require('electron');

const { app, BrowserWindow, globalShortcut: gsc, Menu: menu, shell } = electron;
const APPVERSION = require('./package.json').version;
const JSONStorage = require('node-localstorage').JSONStorage;

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  require('electron-debug')({ showDevTools: true });
}

global.nodeStorage = new JSONStorage(app.getPath('userData') + (process.env.NODE_ENV === 'development' ? '/dev' : ''));

let mainWindow = null;
app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  let windowState = {};
  try {
    windowState = global.nodeStorage.getItem('window-state') || {};
  } catch (err) {
    console.log('empty window state file, creating new one.');
  }

  const windowSettings = {
    show: false,
    title: 'Nettie',
    background: '#ffffff',
    icon: __dirname + '/assets/img/me.png',
    x: windowState.bounds && windowState.bounds.x || undefined,
    y: windowState.bounds && windowState.bounds.y || undefined,
    width: windowState.bounds && windowState.bounds.width || 800,
    height: windowState.bounds && windowState.bounds.height || 600,
    'web-preferences': {
      overlayScrollbars: true,
    },
  };

  mainWindow = new BrowserWindow(windowSettings);
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    // Restore maximised state if it is set. not possible via options so we do it here
    if (windowState.isMaximized) {
      mainWindow.maximize();
    }
    mainWindow.focus();
  });

  const dispatchShortcutEvent = (ev) => {
    mainWindow.webContents.send('executeShortCut', ev);
  };

  const registerShortcuts = () => {
    gsc.register('CmdOrCtrl+b', () => {
      dispatchShortcutEvent('toggle-sidebar');
    });
  };

  registerShortcuts();

  mainWindow.on('focus', () => {
    registerShortcuts();
  });

  mainWindow.on('blur', () => {
    gsc.unregisterAll();
  });

  const storeWindowState = () => {
    windowState.isMaximized = mainWindow.isMaximized();
    if (!windowState.isMaximized) {
      // only update bounds if the window isn't currently maximized
      windowState.bounds = mainWindow.getBounds();
    }
    global.nodeStorage.setItem('window-state', windowState);
  };

  ['resize', 'move', 'close'].forEach((event) => {
    mainWindow.on(event, () => {
      storeWindowState();
    });
  });

  const template = [{
    label: app.getName(),
    submenu: [{
      label: 'Toggle Sidebar',
      accelerator: 'CmdOrCtrl+b',
      click() {
        dispatchShortcutEvent('toggle-sidebar');
      },
    },
    {
      type: 'separator',
    },
    {
      label: process.platform === 'darwin' ? 'About ' + app.getName() : 'Website',
      click() {
        shell.openExternal('https://messenger-demo-viewer.kilianvalkhof.com');
      },
    },
    {
      label: 'Support',
      click() {
        shell.openExternal('https://github.com/Kilian/messenger-demo-viewer/issues');
      },
    },
    {
      label: 'Check for updates (current: ' + APPVERSION + ')',
      click() {
        shell.openExternal('https://github.com/Kilian/messenger-demo-viewer/releases');
      },
    },
      process.platform === 'darwin' ? {
        type: 'separator',
      } : false,
      process.platform === 'darwin' ? {
        label: 'Hide ' + app.getName(),
        accelerator: 'Command+H',
        role: 'hide',
      } : false,
      process.platform === 'darwin' ? {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      } : false,
      process.platform === 'darwin' ? {
        label: 'Show All',
        role: 'unhide'
      } : false,
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click() {
        app.quit();
      },
    }].filter(x => x),
  },
  process.platform === 'darwin' ? {
    label: 'Edit',
    submenu: [{
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      selector: 'undo:'
    }, {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      selector: 'redo:'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      selector: 'cut:'
    }, {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      selector: 'copy:'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      selector: 'paste:'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      selector: 'selectAll:'
    }],
  } : false].filter(x => x);

  const menuBar = menu.buildFromTemplate(template.map(x => x));
  menu.setApplicationMenu(menuBar);
});
