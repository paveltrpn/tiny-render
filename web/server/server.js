
import { createServer, IncomingMessage, ServerResponse } from "http";

(function main() {
    const host = "localhost";
    const port = 8000;
    
    /**
     * 
     * @param {IncomingMessage} req 
     * @param {ServerResponse} res 
     */
    const requestListener = function (req, res) {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(`<html><body><h1>This is HTML</h1></body></html>`);
    };
    
    const server = createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
})()