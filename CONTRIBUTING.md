# WARNING

This doc is woefully under-written and needs to be fleshed out. If you're interested in hacking on Create React Native App but aren't finding this information to be enough, please contact a maintainer or open an issue.

## Developing

Run `yarn` in the repo root to install prettier. Use `yarn run format` before submitting any PRs to ensure consistent code style.

You'll need to install dependencies in both `create-native-graphql-app` and `native-graphql-scripts` and also start the watchers in both. It's also a good idea to tell npm/yarn that your local copy of native-graphql-scripts can be linked into projects where it's a dependency:

```
# you may need to yarn unlink native-graphql-scripts before this will work
$ cd path-to-repo-root/native-graphql-scripts
$ yarn link
```

### Creating a test project

If you're trying to make a change to the behavior of the init process, then you'll need to do something like this:

```
# replace the paths appropriately, and also the native-graphql-scripts version number
$ cd path-to-repo-root/native-graphql-scripts && npm pack
$ cd path-to-project-dir

# you may need to run yarn cache clean here if you've previously done this with a different tarball
$ path-to-repo-root/create-native-graphql-app/build/index.js testing-my-change \
    --scripts-version path-to-repo-root/native-graphql-scripts/native-graphql-scripts-0.1.0.tgz
$ cd testing-my-change
$ yarn link native-graphql-scripts
```

Otherwise, just create the app from the npm packages and you can link your modified scripts in afterwards:

```
$ cd path-to-project-dir
$ create-native-graphql-app testing-my-change
```

### Linking native-graphql-scripts

Once your test project is initialized (whether using your custom init change or not), you'll need to link back to native-graphql-scripts to see any changes you make:

```
$ cd path-to-project-dir/testing-my-change
$ yarn link native-graphql-scripts
```

Once this is linked and the watcher is running, you should be able to see any changes you make to the project scripts when you run them inside your test project.

## Working on dependencies of native-graphql-scripts

If you're testing changes to one of native-graphql-scripts' dependencies (say, xdl), then if you've linked that local version of the dependency into your test project, you may run into haste module clashes when running the React Native packager. If you do run into these issues, then you'll need to tell the packager how to ignore any duplicate dependencies it pulls in as a result of seeing both original and compiled source directories.

You'll specify a CLI config file in your test project's app.json:

```
{
  "expo": {
    "sdkVersion": "12.0.0",
    "packagerOpts": {
      "config": "rn-cli.config.js"
    }
  }
}
```

And place a file like this in the root of your test project:

```
// rn-cli.config.js

'use strict';

var blacklist = require('react-native/packager/blacklist');

var toExport = {
  getBlacklistRE() {
    // this is an example using xdl, replace with any uncompiled source directories that are
    // causing haste module conflicts
    var subList = [
      /xdl\/src\/.*/
    ];

    // these statements are just to confirm that you've cleared the cache and
    // that the new blacklists are being picked up
    var list = blacklist(subList);
    console.log(`RN-CLI.CONFIG.JS: passing ${list} to RN packager as blacklist`);
    return list;
  },
};

module.exports = toExport;
```

Once you've set these up, make sure to run `$ node_modules/react-native/packager/packager.sh --reset-cache` and exit it once the packager is loaded before you try any npm/yarn commands again. This will make sure that the new CLI config is picked up.
