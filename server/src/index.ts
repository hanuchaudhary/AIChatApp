import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const PORT = 8080;

const server = http.createServer((request: any, response: any) => {
    console.log("Hlo there!")
})

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
    console.log("Connected")

    ws.on("message", (message: string) => {
        console.log("Received: ", message)
    })

});

server.listen(PORT || 8080, () => {
    console.log(`Server started on port ${PORT}`)
})