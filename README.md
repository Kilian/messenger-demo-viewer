<img src="assets/img/me.128.png">

# Messenger Demo Viewer
Demo your Facebook Messenger (bot) interaction in a screen without showing the sidebar with all your other personal chats.

## Usage
By default the sidebar is hidden. Press `Ctrl + b` or `Cmd + b` to toggle it on and off. Use Messenger like you normally do.

## Installation
You can download installation packages for all three platforms from the releases page on Github: https://github.com/kilian/messenger-demo-viewer/releases

To download

```sh
git clone https://github.com/Kilian/messenger-demo-viewer.git
cd messenger-demo-viewer
npm install
```

To run development version:
```
npm run dev
```

To create packaged excecutables for all platforms:
```
npm run package
```

To create an installer:
```sh
# for windows (exe)
npm run dist:win

# for mac (dmg)
npm run dist:mac

# for linux (deb and tar)
npm run dist:lin
```


### License
The messenger demo viewer is licensed under ISC. It is not affiliated with Facebook or Messenger.
