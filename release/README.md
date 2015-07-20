## For Android

http://ionicframework.com/docs/guide/publishing.html

```
$ cordova build android --release

$ keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore /private/var/www/frappe/mobile/platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name

$ /usr/local/Cellar/android-sdk/24.1.2/build-tools/22.0.1/zipalign -v 4 /private/var/www/frappe/mobile/platforms/android/build/outputs/apk/android-release-unsigned.apk erpnext.apk
```
