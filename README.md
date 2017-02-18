<img src="assets/img/me.128.png">

# Messenger Demo Viewer
Demo Facebook Messenger (bot) interactions without showing personal chats. Hides the sidebar automatically.

## Usage
By default the sidebar is hidden. Press `Ctrl + b` or `Cmd + b` or the menu to toggle it on and off. Use Messenger like you normally do.

## Installation
Recent downloads for macOS, Windows and Linux available on [the website](https://messenger-demo-viewer.kilianvalkhof.com) or [the releases page on Github](https://github.com/kilian/messenger-demo-viewer/releases)

### Development

```sh
git clone https://github.com/Kilian/messenger-demo-viewer.git
cd messenger-demo-viewer
npm install
```

To run development version:
```
npm run dev
```

### Build your own executables

To create packaged excecutables for all platforms:
```
npm run package
```
To create an installer:
```sh
# for windows (exe)
npm run dist:win

# for mac (dmg) only available on mac.
npm run dist:mac

# for linux (deb and tar)
npm run dist:lin
```


### License
Messenger demo viewer is licensed under ISC. It is not affiliated with Facebook or Messenger.
