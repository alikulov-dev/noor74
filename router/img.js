const express = require('express');
const router = express.Router();
const multer = require('multer');
const img = require('../db/models/img');
const dotenv = require("dotenv");
const { userLogger } = require('../helpers/logger');

//for configuration
dotenv.config();

const URL = process.env.URL || 'http://localhost:8080/';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

var upload = multer({ storage: storage })
router.post('/', upload.single('myFile'), async (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return res.status(400).json({ code: 400, message: 'Please upload a file' });
    }
    //checking format of file
    const file_type = file.originalname.substr(file.originalname.indexOf('.') + 1);
    if (file_type != ('png' || 'jpg')) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        userLogger.info(error);
        return res.status(400).json({ code: 400, message: 'Please send an image(*.jpg or *.png)' });

    }
    // userLogger.info(file);
    // console.log(file_type);
    const imagepost = new img({
        image: URL + file.path
    })
    // console.log(file)
    const savedimage = await imagepost.save()
    res.status(201).json({ code: 201, image: savedimage });
    
})

router.get('/list', async (req, res) => {

    const image = await img.find();

    return res.status(202).json({ code: 202, list_of_images: image });
    
})
module.exports = router;