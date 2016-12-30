# Doc Engine

Custom-made and quite powerful static site generator based on the very helpful [static-site-generator-webpack-plugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin).

## Features

- inlining minimal necessary css for each page
- very meaningful first paint after downloading the html (page would works without downloading any js)
- after loading the js file, [react-router](https://github.com/ReactTraining/react-router) takes over the routing
- automatic code splitting for all the routes
- to create a new page, just add a new file inside the `src/pages` folder
- nice dev experience: auto reload page when file changed

At some point this engine probably will be setup as a separate repo.

## Start hacking on the docs

```
npm install
npm start
```

## Generate docs

```
npm run build
```
