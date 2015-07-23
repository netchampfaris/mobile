Mobile app for ERPNext

Install Platforms

```
$ cordova platform add ios
$ cordova platform add android
```

Install Plugins:

```
$ cordova plugin add cordova-plugin-statusbar
$ cordova plugin add cordova-plugin-inappbrowser
```

Build iOS:

```
$ cordova build ios && cordova emulate ios && open -a "ios simulator"
```
