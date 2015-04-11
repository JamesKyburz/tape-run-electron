# tape-run-atom-shell

A [tape](https://github.com/substack/tape) test runner that runs your tests in [atom-shell](https://github.com/atom/atom-shell)

```
cat tests/*.js | tape-run-atom-shell
```
or
```
browserify tests/*.js | tape-run-atom-shell
```

You need to have atom-shell and tape locally or globally

## Gotchas

atom-shell is not really a browser.

__dirname is global which may break tests.

For now I suggest running with browserify or such as thats what you're
testing anyhows ;)
