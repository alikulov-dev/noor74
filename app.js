require('./db/database')
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require('http');
const auth=require('./middleware/auth')
// const multer = require('multer');
// const img=require('./db/models/img')

// routers
const client_routes = require('./router/client_auth')
const img_routes = require('./router/img')

// utils
dotenv.config();
const app = express();
const PORT = process.env.NODE_PORT || 8080;
// app.use(morgan("dev"));
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(__dirname + '/uploads'));


// app.use(taskRoutes);
app.use('/img',auth, img_routes);
app.use('/client', client_routes);
app.use('/welcome', (req, res) => {
    res.json({ name: "Hello" })
})


// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname)
//     }
// })

// var upload = multer({ storage: storage })
// app.post('/upload', upload.single('myFile'), async (req, res, next) => {
//     const file = req.file
//     if (!file) {
//         const error = new Error('Please upload a file')
//         error.httpStatusCode = 400
//         return next("hey error")
//     }


//     const imagepost = new img({
//         image: file.path
//     })
//     const savedimage = await imagepost.save()
//     res.json(savedimage)

// })

// app.get('/image', async (req, res) => {
//     const image = await img.find()
//     res.json(image)

// })


app.listen(PORT, (err) => {
    if (err) { console.log(`Error:${err}`) }
    console.log(`Running on port ${PORT}`);
});