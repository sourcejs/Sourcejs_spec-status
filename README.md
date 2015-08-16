Spec Status
===============

[![Gitter chat](https://img.shields.io/badge/gitter-join%20chat-1dce73.svg)](https://gitter.im/sourcejs/Source)

[SourceJS](http://sourcejs.com) plugin for Spec Statuses. Define the state of specific spec page with `dev`, `rec`, `ready`, `deprecated` or any custom badges.

![image](https://monosnap.com/file/3L2YMOnznEj90QjdZj7Ad8LQ8h1i6P.png)

It's also possible to assign different statuses to subsections of the Spec by adding corresponding status-class to source section, e.g.:

```
<div class="source_section status-deprecated">
```

## Installation

Set-up required [dependencies](#dependencies) for the plugin.

Then install plugin to SourceJS running npm in `sourcejs/user` folder:

```
npm install sourcejs-spec-status --save
```

### Update build

```
cd sourcejs
npm run build
```

Or if you're using sourcejs-npm set-up:

```
cd node_modules/sourcejs
npm run build
```

After build is finished, open any spec in enabled catalogue and check the header `source_info` section.

## Options

Define plugin options in `sourcejs/user/options.js` file:

```
assets: {
  pluginsOptions: {
    specStatus: {
      enabledCatalogs: ['specs']
    },
  }
}
```

## Dependencies

### [CouchDB](http://couchdb.apache.org/)

Install it, run locally or remotely and configure your SourceJS in `/user/options.js`:

```
assets: {
  modulesOptions: {
    couch: {
      server: 'http://custom-couch-db.url:5984' // Defaults to http://127.0.0.1:5984
    },
  }
}
```

Note: CouchDB must be [configured](https://wiki.apache.org/couchdb/CORS) to allow CORS. Change database configuration from file, or use integrated admin panel - http://127.0.0.1:5984/_utils/config.html.

## Upcoming updates

* Change database solution to SourceJS storage

Compatible with SourceJS v0.4+, for v0.3.* use [previous release](https://github.com/sourcejs/sourcejs-spec-status/archive/v0.1.0.zip).

## FAQ

### Entry JS file is not loaded

If you get a similar 404 loading error for `sourcejs-spec-status.js` as in [this issue](https://github.com/sourcejs/sourcejs-spec-status/issues/7), then re-check if you have re-build SourceJS engine assets with `npm run build`.