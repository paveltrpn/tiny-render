
import { createServer, IncomingMessage,  ServerResponse} from 'http';
import { parse } from 'url';
import { readFile } from 'fs';

(async function main() {
    const host: string = "localhost";
    const port: number = 8000;

    const requestListener = function (request: IncomingMessage, response: ServerResponse) {
        var path = parse(request.url).pathname;
        let __dirname: string = "./app"  
        readFile(__dirname + path, function(error, data) {  
            if (error) {  
                response.writeHead(404);  
                response.write('This page does not exist');
                response.end();  
            } else {  
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
})()