This is a client-only version of the pants-demo-site.

## Running in development

In `src/node/toolchain/pants-visualizer`:

```shell
yarn start
```

Upon the first run, this will spend a bit of time building the web assets,
serve them at `localhost:3000`, and open the default web browser to that page.

## Building for deployment

In `src/node/toolchain/pants-visualizer`:

```shell
yarn build
```

Then open `src/node/toolchain/pants-visualizer/build/index.html` in a browser.
The build process injects tags into index.html that load the JS app.

## Running unit tests

In `src/node/toolchain/pants-visualizer`:

```shell
yarn test

# In CI run:
yarn test-ci
```

## Running browser tests with cypress

In `src/node/toolchain/pants-visualizer`:

```shell
yarn start
```

Once the app is running, in a second terminal window run:

```shell
yarn cypress-test
```

## Linting/formatting

In `src/node/toolchain/pants-visualizer`:

```shell
yarn lint
yarn prettier
# In CI run:
yarn prettier-check
```