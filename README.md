Spec Status
===============

[SourceJS](http://sourcejs.com) plugin for Spec Statuses. Define the state of specific Spec with `dev`, `rec`, `ready`, `deprecated` or any custom badges.

![image](http://take.ms/g6r9t)

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

Compatible with SourceJS v0.4+, for v0.3.* use [previous release](https://github.com/sourcejs/sourcejs-spec-status/archive/v0.1.0.zip).