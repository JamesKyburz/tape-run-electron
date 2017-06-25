# tape-run-electron

[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/tape-run-electron.svg)](https://greenkeeper.io/)

A [tape](https://github.com/substack/tape) test runner that runs your tests in [electron](https://github.com/atom/electron)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

```
cat tests/*.js | tape-run-electron
```
or
```
browserify tests/*.js | tape-run-electron
```

You need to have [electron](http://npm.im/electron-prebuilt) and [tape](http://npm.im/tape) locally or globally

## Install

npm install tape-run-electron

## Gotchas

electron is not really a browser.

__dirname is global which may break tests.

For now I suggest running with browserify or such as thats what you're
testing anyhows ;)
