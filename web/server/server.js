import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
(async function main() {
    const host = "localhost";
    const port = 8000;
    const requestListener = function (request, response) {
        var path = url.parse(request.url).pathname;
        let __dirname = "./app";
        fs.readFile(__dirname + path, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('This page does not exist');
                response.end();
            }
            else if (path.endsWith(".html")) {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.write(data);
                response.end();
                console.log(`file ${path} fetched!`);
            }
            else if (path.endsWith(".js")) {
                response.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                response.write(data);
                response.end();
                console.log(`file ${path} fetched!`);
            }
            else if (path.endsWith(".glsl")) {
                response.writeHead(200, {
                    'Content-Type': 'taxt/plain'
                });
                response.write(data);
                response.end();
                console.log(`file ${path} fetched!`);
            }
        });
    };
    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
})();
