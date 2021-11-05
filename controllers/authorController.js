// const express = require('express');
// var router = express.Router();
// const mongoose = require('mongoose');
// const Author = mongoose.model('Author');
// const Blog = mongoose.model('Blog');
// const Joi = require('joi');
// JoiObjectId = require('joi-objectid');
// const myJoiObjectId = JoiObjectId(Joi);
// var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
// const logger = require('../../../middleware/winston')


// const authorSchema = Joi.object({
//     fullName: Joi.string()
//         .min(3)
//         .max(50)
//         .required(),
//     email: myJoiObjectId(),
//     mobile: Joi.number()
//         .integer()
//         .min(1900)
//         .max(999999999999),
//     city: Joi.string()
//         .alphanum()
//         .min(3)
//         .max(50)
// });

// router.get('/', (req, res) => {
//     // logger.info('Hello World, this is an author page, frhnfurj')
//     res.send('Hello World, this is an author page');
//     logger.info("Server Sent A Hello World!");
// });

// router.post('/create', insertRecord);
// // router.post("/", async (req, res) => {
// //     const author = new Author(req.body);
// //     console.log(req.body);
// //     try {
// //       await author.save();
// //       res.send(author);
// //     } catch (error) {
// //       res.status(500).send(error);
// //     }
// // });

// function insertRecord(req, res) {
//     var author = new Author();
//     var emaill;
//     console.log("emaill");
//     console.log(emaill);
//     author.fullName = req.body.fullName;
//     author.mobile = req.body.mobile;
//     author.email = emaill;
//     author.city = req.body.city;
//     // console.log(author)
//     Blog.find({ about: req.body.email }, (err, docs) => {
//         console.log("First")
//         if (docs.length < 1) {
//             const small = new Blog();
//             small.title = req.body.email;
//             small.about = req.body.email;
//             small.save(function (err) {
//                 if (err) return handleError(err);
//                 // saved!
//                 emaill = small._id;
//                 console.log(emaill)
//             });
//         } else {
//             emaill = docs[0]._id;
//             console.log(emaill)
//         }
//     });
//     const value = authorSchema.validate(req.body);
//     if (value.error) {
//         return res.status(422).json({
//             message: 'Validation error.',
//             error: value.error,
//         });
//     }
//     // console.log(author);
//     // return console.log({"email":req.body.email});
//     // Blog.find({about:req.body.email}, (err, docs) => {
//     //     console.log(docs)
//     //     if (docs.length<1) {
//     //         const small = new Blog();
//     //         small.title=author._id;
//     //         small.about=req.body.email;
//     //         small.save(function (err) {
//     //             if (err) return handleError(err);
//     //             // saved!

//     //             console.log("saved")
//     //         });
//     //     };
//     // });

//     author.save((err, doc) => {
//         if (!err)
//             res.send(doc)
//         else {
//             if (false) {
//                 handleValidationError(err, req.body);
//                 res.render("employee/addOrEdit", {
//                     viewTitle: "Insert Employee",
//                     employee: req.body
//                 });
//             }
//             else
//                 console.log('Error during record insertion : ' + err);
//         }
//     });
// }

// function updateRecord(req, res) {
//     Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
//         if (!err) { res.redirect('author/list'); }
//         else {
//             if (err.name == 'ValidationError') {
//                 handleValidationError(err, req.body);
//                 res.render("employee/addOrEdit", {
//                     viewTitle: 'Update Employee',
//                     employee: req.body
//                 });
//             }
//             else
//                 console.log('Error during record update : ' + err);
//         }
//     });
// }


// router.get('/list', (req, res) => {
//     Author.find({}, (err, docs) => {
//         if (0 == docs.length) {
//             return res.status(200).json({
//                 message: 'There is not any authors',
//                 authors: docs,
//             });
//         };
//         if (!err) {

//             res.render("table", { data: docs });
//         }
//         else {
//             return res.status(404).json({
//                 message: 'There is not any authors',
//                 authors: docs,
//             });
//         }
//     });
// });


// // function handleValidationError(err, body) {
// //     for (field in err.errors) {
// //         switch (err.errors[field].path) {
// //             case 'fullName':
// //                 body['fullNameError'] = err.errors[field].message;
// //                 break;
// //             case 'email':
// //                 body['emailError'] = err.errors[field].message;
// //                 break;
// //             default:
// //                 break;
// //         }
// //     }
// // }

// router.get('/delete/:id', (req, res) => {
//     const id = req.params.id;
//     if (!checkForHexRegExp.test(id)) {
//         return res.status(422).json({
//             message: 'Id is not valid',
//             error: id,
//         });
//     }
//     Author.findOneAndDelete({
//         _id: id
//     })
//         .exec((err, author) => {
//             if (!author)
//                 return res.status(500).json({ code: 500, message: 'There was an error deleting the post', error: err })
//             res.status(200).json({ code: 200, message: 'Post deleted', deletedPost: author })
//         });
// })

// router.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     if (!checkForHexRegExp.test(id)) {
//         return res.status(422).json({
//             message: 'Id is not valid',
//             error: id,
//         });
//     }
//     const result = await Author.find({ _id: id });
//     if (result.err) { 
//         return res.status(500).json({ code: 500, message: 'There as not any author yet', error: err }) 
//     }
//     else {
//         return res.status(200).json({ code: 200, message: 'Auther exist', author: result })
//     };
//     // .exec((err, author) => {
//     //     console.log(author)
//     //     if (!author)
//     //         return res.status(500).json({ code: 500, message: 'There as not any author yet', error: err })
//     //     res.status(200).json({ code: 200, message: 'Auther exist', author: author })
//     // });
// });

// // router.post('/update/:id', (req, res) => {
// //     const { id } = req.params;
// //     const { fullName, email, mobile, city } = req.body;

// //     // if (!req.user)
// //     //   res.status(403).json({ code: 403, response: "Unauthorized request" });

// //     const query = {
// //         _id: id
// //     };

// //     const newValues = {
// //         fullName: fullName,
// //         email: email,
// //         mobile: mobile,
// //         city: city
// //     };
// //     console.log(query);
// //     console.log(newValues);
// //     Author.updateOne(query, newValues, { new: true })
// //         .then(unlikedPost => {
// //             if (!unlikedPost)
// //                 return res.status(403).json({ code: 403, response: "You haven't liked this post yet" });
// //             res.status(200).json({ code: 200, response: unlikedPost })
// //         })
// //         .catch(e => res.status(500).send("There were an error"));
// // }
// // )
// router.post('/update/:id', (req, res) => {
//     const id = req.params.id;
//     const { fullName, email, mobile, city } = req.body;
//     const value = authorSchema.validate(req.body);
//     const newValues = {
//         fullName: fullName,
//         email: email,
//         mobile: mobile,
//         city: city
//     };
//     if (!checkForHexRegExp.test('' + id + '')) {
//         return res.status(422).json({
//             message: 'Id is not valid',
//             error: id,
//         });
//     }
//     if (value.error) {
//         return res.status(422).json({
//             message: 'Validation error.',
//             error: value.error,
//         });
//     }
//     Author.findByIdAndUpdate(id, newValues)
//         .then((data) => {
//             return res.status(200).json({
//                 success: true,
//                 id: id,
//                 data: data
//             });
//         })
//         .catch((error) => {
//             console.log(error);
//             return res.status(500).json({
//                 success: false,
//                 data: error,
//             });
//         });
// });
// module.exports = router;