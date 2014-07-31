Spec Status
===============

[SourceJS](http://sourcejs.com) plugin for Spec Statuses.

![image](http://d.pr/i/Qu0e+)

To install, run npm:

```
npm install git://github.com/sourcejs/sourcejs-spec-status --save
```

And config plugin for your preferred catalogues (specs folder names) in `/user/options.js`:

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

Install it, run locally or remotely and configure youre SourceJS in `/user/options.js`:

```
assets: {
  modulesOptions: {
    couch: {
      server: 'http://couch-db.url:5984'
    },
  }
}
```

Compatible with SourceJS v0.4+, for v0.3.* use [previous release](https://github.com/sourcejs/sourcejs-spec-status/archive/v0.1.0.zip).
