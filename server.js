const http = require('http');
const env = require('dotenv');
env.config({
    path:"./.env"
});

const hostname = '127.0.0.1';

const port = process.env.PORT ;
const app = require('./app');
const server = http.createServer(app);
//server.listen(port);

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
});