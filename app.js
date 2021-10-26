require('./db/database')
const express=require("express");
const dotenv=require("dotenv");
const bodyParser=require("body-parser");
const morgan=require("morgan");
const http = require('http');

// routers


// utils
dotenv.config();
const app = express();
const PORT = process.env.NODE_PORT||8080;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(taskRoutes);
// app.use(contactRoutes);

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(PORT,(err)=>{
    if(err){console.log(`Error:${err}`)}
    console.log(`Running on port ${PORT}`);
});