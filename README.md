# 4ZZZfm Mobile App

It's time to finally update this poor ancient app.

I think it's very much in the spirit of community radio for the app to be open source, so this time it is.

```
npm install
```

Then add any platforms:

```
cordova platform add adroid ios
```

Next, to run the hot module reloading server:

```
npm start
```

To view in a browser, use `http://localhost:8080`

To run on a simulator, open another terminal:

```
npm run ios
```

or

```
npm run android
```

To build for running on an actual device:

```
npm build -- ios
```

or

```
npm build -- android
```

Then continue to use the regular Cordova commands such as `cordova run ios --device`, etc


# License

MIT. Copyright (c) 2016 Tommy-Carlos Williams.
