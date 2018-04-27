# JSA-web

CMUJSA website.

## Installation

1. Install `node.js` (`v6.4.0` or higher).
2. Clone this repository: `git clone git@github.com:Rikilele/JSA-web`
3. Go to the repository's root: `cd JSA-web`
4. Install `node.js` dependencies: `npm install`

## Development scripts

To run development scripts, use `npm run <script>`. Available scripts include:
- `doc-lib`: Generates documentation for `lib/`.
- `doc-src`: Generates documentation for `src/`.
- `live`: Starts a live-reloading development server.
    - `npm run live <port>` allows configuration of the listening port.
- `watch`: Starts watching for `src/` changes to trigger rebuilds of `dist/`.
- `build`: Performs a single development build of `dist/`.
- `dist`: Performs a single production build of `dist/`.
- `lint`: Lints the codebase.

