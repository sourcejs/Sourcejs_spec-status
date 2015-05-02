Spec Status
===============

[SourceJS](http://sourcejs.com) plugin for Spec Statuses. Define the state of specific Spec with `dev`, `rec`, `ready`, `deprecated` or any custom badges.

![image](https://monosnap.com/file/3L2YMOnznEj90QjdZj7Ad8LQ8h1i6P.png)

It's also possible to assign different statuses to subsections of the Spec by adding corresponding status-class to source section, e.g.:

```
<div class="source_section status-deprecated">
```

## Installation 

To install it, run npm in `sourcejs/user` folder:

```
npm install sourcejs-spec-status --save
```

Then run Grunt update in SourceJS root:

```
cd sourcejs
grunt update
```

After restarting the app and defining enabled Spec catalogues in options, you will be able to set status to your Specs.

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
      server: 'http://couch-db.url:5984'
    },
  }
}
```

Note: CouchDB must be [configured](https://wiki.apache.org/couchdb/CORS) to allow CORS. Change database configuration from file, or use integrated admin panel - http://127.0.0.1:5984/_utils/config.html.

## Upcoming updates

* Change database solution to SourceJS storage

Compatible with SourceJS v0.4+, for v0.3.* use [previous release](https://github.com/sourcejs/sourcejs-spec-status/archive/v0.1.0.zip).
