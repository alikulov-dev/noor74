const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const Joi = require('joi');
const bcrypt = require('bcrypt')
const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
const rateLimit = require('../helpers/request_limitter');
const { userLogger } = require('../helpers/logger');
// const {logger} = require('../helpers/logger');
// const multer=require('multer')
const User = require("../db/models/user");

//request limitter
// const createAccountLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minut window
//   max: 5, // start blocking after 5 requests
//   message:
//     "Too many accounts created from this IP, please try again after an hour"
// });

// const userSchema = Joi.object({
//   username: Joi.string()
//     .trim()
//     .min(4)
//     .max(25),
//   first_name: Joi.string()
//     .required()
//     .trim()
//     .min(4)
//     .max(25),
//   last_name: Joi.string()
//     .trim()
//     .min(4)
//     .max(25),
//   father_name: Joi.string()
//     .trim()
//     .min(4)
//     .max(25),
//   email: Joi.string()
//     .trim()
//     .email({ minDomainSegments: 2, tlds: { allow: ['ru', 'com'] } })
//     .min(10)
//     .max(200),
//   phone: Joi.string()
//     .trim()
//     .email({ minDomainSegments: 2, tlds: { allow: ['ru', 'com'] } })
//     .min(10)
//     .max(200),
//   email: Joi.string()
//     .trim()
//     .email({ minDomainSegments: 2, tlds: { allow: ['ru', 'com'] } })
//     .min(10)
//     .max(200)
// });
// const upload = multer({ dest: "public/files" });

//( /User/register) in order to register User
router.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, father_name, email, img_id, phone, password, role } = req.body;
    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).json({ code: 400, message: 'All input is required' });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ code: 400, message: 'User Already Exist. Please Login' });
      // return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //User validated
    const value = {
      first_name: first_name,
      last_name: last_name,
      father_name: father_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      img_id:img_id,
      phone: phone,
      password: encryptedPassword,
      role: role
    };
    // const error=cli
    //genrrating img url
    // const img = upload.single("myFile")
    // const img = new UserSchema({ name: name,url: url})
    // Create User in our database
    //add image if it exist
    // if (name || url) {
    //   value.img = { name: name, url: url }
    // }
    const baseUser = new User(value);
    // validation
    const error = baseUser.validateSync();
    if (error) {
      return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
      // return res.status(409).send("Validatioan error");
    }
    const user = await baseUser.save();
    // Create token
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      "123456",
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    // if (name && url) {
    //   User.img = { name: name, url: url }
    // }
    // return new user
    res.status(201).json(user);
  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
  // Our register logic ends here
});

//( /User/login) in order to login User
router.get("/login", rateLimit, async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, role: user.role },
        "123456",
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    }
    return res.status(200).json({ code: 200, message: 'User does not exist and deleted' });
  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
  // Our register logic ends here
});

//( /user/list) in order to get list of Users
router.get("/list", async (req, res) => {
  let { pageNumber, pageSize } = req.body;
  pageNumber=parseInt(pageNumber);
  pageSize=parseInt(pageSize);
  // this only needed for development, in deployment is not real function
  try {

    const user = await User.find()
      .skip((pageNumber - 1) * pageSize) 
      .limit(pageSize)           
      .sort({ first_name: 1 });
    // console.log(User)
    return res.status(202).json({ code: 202, list_of_Users: user });

  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
});

//( /User/update/:id) in order to update specific User
router.post("/update/:id", async (req, res) => {

  const id = req.params.id;
  //id check
  if (!checkForHexRegExp.test('' + id + '')) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }
  const { first_name, last_name, father_name, email, img_id, phone, password, role } = req.body;
  // const value = authorSchema.validate(req.body);
  const newValues = {
    first_name: first_name,
    last_name: last_name,
    father_name: father_name,
    email: email.toLowerCase(), // sanitize: convert email to lowercase
    img_id:img_id,
    phone: phone,
    role: role
  };

  const baseUser = new User(newValues);
  // validation
  const error = baseUser.validateSync();
  if (error) {
    return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
    // return res.status(409).send("Validatioan error");
  }
  // img update logic starts here 

  // img update logic ends here 

  // if (value.error) {
  //   return res.status(422).json({
  //     message: 'Validation error.',
  //     error: value.error,
  //   });
  // }
  // const User = await User.findOne({ _id: id }, (err, User) => {
  //   User.img.name(name);
  // });
  // const img = await User.find({ _id: id });

  // if (User.img[0].name != name) {
  //   newValues.img = { name: name, url: url }
  // }

  // this only needed for development, in deployment is not real function
  const user = await User.findOneAndUpdate({ _id: id }, newValues);

  if (user.err) {
    return res.status(500).json({ code: 500, message: 'There as not any Users yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'User exist and updated', oldUser: user })
  };
});

//( /User/delete/:id) in order to delete specific User
router.get("/delete/:id", async (req, res) => {

  const id = req.params.id;

  if (!checkForHexRegExp.test('' + id + '')) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }

  // this only needed for development, in deployment is not real function
  const user = await User.findOneAndDelete({ _id: id });

  if (user.err) {
    return res.status(500).json({ code: 500, message: 'There as not any Users yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'User exist and deleted', deleted_User: user })
  };
});

//( /getone/:id) in order to get specific User
router.get("/getone/:id", async (req, res) => {

  const id = req.params.id;
  // id valid chech
  if (!checkForHexRegExp.test(id)) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }

  // this only needed for development, in deployment is not real function
  const user = await User.find({ _id: id });

  if (user.err) {
    return res.status(500).json({ code: 500, message: 'There as not any Users yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'User exist', user: user })
  };
});
module.exports = router;