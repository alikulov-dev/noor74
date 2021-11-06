const express = require('express');
const router = express.Router();
const multer = require('multer');
const img=require('../db/models/img')

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
        return next("hey error")
    }

    // cosnole.log(file)
    const imagepost = new img({
        image: file.path
    })
    console.log(file)
    const savedimage = await imagepost.save()
    res.json(savedimage)

})

router.get('/list', async (req, res) => {
    const image = await img.find()
    res.json(image)

})
module.exports = router;