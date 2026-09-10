const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT, 10) || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    // Standardize URL paths
    let filePath = '.' + req.url;
    if (filePath === './' || filePath === './#home') {
        filePath = './index.html';
    }

    // Strip query parameters or hash fragments
    filePath = filePath.split('?')[0].split('#')[0];

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Return 404 page if not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 File Not Found</h1>', 'utf-8');
            } else {
                // Internal server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code} ..\n`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function startServer(portToUse) {
    server.listen(portToUse, () => {
        console.log(`\n==================================================`);
        console.log(`  JMJ School Server running successfully!`);
        console.log(`  Access the site at: http://localhost:${portToUse}`);
        console.log(`==================================================\n`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        PORT += 1;
        console.log(`Port ${PORT - 1} is already in use. Trying port ${PORT}...`);
        setTimeout(() => startServer(PORT), 200);
    } else {
        console.error('Server error:', err);
    }
});

startServer(PORT);

