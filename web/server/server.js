import { createServer } from 'http';
import { parse } from 'url';
import { readFile } from 'fs';
(async function main() {
    const host = "localhost";
    const port = 8000;
    const requestListener = function (request, response) {
        var path = parse(request.url).pathname;
        let __dirname = "./app";
        readFile(__dirname + path, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('This page does not exist');
                response.end();
            }
            else {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.write(data);
                response.end();
            }
        });
    };
    const server = createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
})();
