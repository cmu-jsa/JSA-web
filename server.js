'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const publicPath = '/user/fencing/';
const bundleDir = path.resolve(__dirname, 'dist');
const publicDir = path.resolve(__dirname, 'public');
const index = path.join(bundleDir, 'index.html');

function serveFile(res, filepath) {
    return new Promise((resolve, reject) => {
        console.log(filepath);
        fs.createReadStream(filepath)
            .on('error', reject)
            .pipe(res)
            .on('error', reject)
            .on('finish', resolve);
    });
}

function serve(res, contentBase, pathname) {
    const filepath = path.join(contentBase[0], pathname);
    contentBase = contentBase.slice(1);

    return serveFile(res, filepath).catch(err => {
        if (err.code !== 'ENOENT') {
            res.statusCode = 500;
            res.end(err.message, 'utf8');
            return;
        }

        if (contentBase.length > 0) {
            return serve(res, contentBase, pathname);
        }

        // Fallback to SPA router
        return serveFile(res, index);
    });
}

http.createServer(function requestListener(req, res) {
    let { pathname } = url.parse(req.url);
    console.log(`${req.method} ${pathname}`);
    if (!pathname.startsWith(publicPath)) {
        res.statusCode = 302;
        res.setHeader('Location', path.posix.join(publicPath, pathname));
        res.end();
        return;
    }

    pathname = pathname.replace(publicPath, '/');
    if (req.method !== 'GET') {
        res.statusCode = 501;
        return res.end();
    }

    if (pathname === '/') {
        pathname = '/index.html';
    }

    return serve(res, [bundleDir, publicDir], pathname);
}).listen(process.argv[2] || '8080');

