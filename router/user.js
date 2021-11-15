const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
const rateLimit = require('../helpers/request_limitter');
const { userLogger, paymentLogger } = require('../helpers/logger');
// const {logger} = require('../helpers/logger');
// const multer=require('multer')
const User = require("../db/models/user");
const Token = require("../db/models/token");
const sendMail = require("../helpers/sendemail")


//( /user/register) in order to register user
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
    // Validate phone if user exist in our database
    const oldPhone = await User.findOne({ phone });

    if (oldPhone) {
      return res.status(400).json({ code: 400, message: 'Phone Number Already Exist. Please put another number' });
      // return res.status(409).send("User Already Exist. Please Login");
    }
    var code = Math.floor(1000 + Math.random() * 9000);
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //user validated
    const value = {
      first_name: first_name,
      last_name: last_name,
      father_name: father_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      phone: phone,
      img_id: img_id,
      password: encryptedPassword,
      status: code,
      role: role
    };
    // const error=cli
    //genrrating img url
    // const img = upload.single("myFile")
    // const img = new userSchema({ name: name,url: url})
    // Create user in our database
    //add image if it exist
    // if (name || url) {
    //   value.img = { name: name, url: url }
    // }
    const baseuser = new User(value);
    // validation
    var error = baseuser.validateSync();
    if (error) {
      return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
      // return res.status(409).send("Validatioan error");
    }
    const user = await baseuser.save();

    // console.log(emaile)
    // Create token
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      "123456",
      {
        expiresIn: "2h",
      }
    );
    var tokenn = new Token({ _clientId: user._id, token: crypto.randomBytes(16).toString('hex') });
    // validation
    var error = tokenn.validateSync();
    if (error) {
      return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
      // return res.status(409).send("Validatioan error");
    }
    const tekennn = await tokenn.save();
    const text = 'Hello ' + user.first_name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user/confirmation\/' + user.email + '\/' + tekennn.token + '\n\nThank You!\n';
    // console.log(text);
    const emaile = sendMail(email, text);
    // save user token
    user.token = token;
    // if (name && url) {
    //   user.img = { name: name, url: url }
    // }
    // return new user
    res.status(201).json(user);
  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
  // Our register logic ends here
});
//( /user/login) in order to login user
router.post("/login", rateLimit, async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email:email,status:'true' });

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
    return res.status(200).json({ code: 200, message: 'user does not exist and not verified' });
  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
  // Our register logic ends here
});
//( /user/list) in order to get list of users
router.post("/list", async (req, res) => {
  let { pageNumber, pageSize } = req.body;
  pageNumber = parseInt(pageNumber);
  pageSize = parseInt(pageSize);
  // this only needed for development, in deployment is not real function
  try {

    const user = await User.find()
    .skip((pageNumber - 1) * pageSize) 
    .limit(pageSize)           
    .sort({ first_name: 1 });
    // console.log(user)
    return res.status(202).json({ code: 202, list_of_users: user });

  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
});
//( /user/resetpassworduser) in order to get list of users
router.post('/resetpassworduser', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ code: 400, message: 'Wrong email or no users' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  var token = new Token({ _clientId: user._id, token: crypto.randomBytes(16).toString('hex') });
  var error = token.validateSync();
  if (error) {
    return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
    // return res.status(409).send("Validatioan error");
  }
  const teken_save = await token.save();
  const text = 'Hello ' + user.first_name + ',\n\n' + 'Please verify your account again by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user/resetpassword/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n';
  // console.log(text);
  const emaile = sendMail(email, text);
  return res.status(200).json({ code: 200, message: 'We sent e resent link your ', user: user,text:text });
});
//( /user/resetpassword/confirmation/:email/:token) in order to get list of users
router.post('/resetpassword/confirmationp/:email/:token', async (req, res) => {
  const token = req.params.token;
  // const password = req.params.password;
  const  password  = req.body.password;
  // Validate user input
  if (!token) {
    return res.status(400).json({ code: 400, message: 'Input is required' });
  }

  // check if user already exist
  // Validate if user exist in our database
  const tokenUser = await Token.findOne({ token: token });

  if (!tokenUser) {
    return res.status(400).json({ code: 400, message: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  console.log(password)
  encryptedPassword = await bcrypt.hash(password, 10);
  // Validate if user exist in our database
  const user = await USer.findOneAndUpdate({ _id: tokenUser._clientId, email: req.params.email }, { password: encryptedPassword });

  if (!user) {
    return res.status(400).json({ code: 400, message: 'We were unable to find a client for this Reset. !' });
    // return res.status(409).send("User Already Exist. Please Login");
  }

  // encryptedPassword = await bcrypt.hash(password, 10);

  // const client = await Client.findOne({ _id: tokenClient._clientId, email: req.params.email });

  // client.status = 'true';
  // const clientSave = await client.save();
  // if (clientSave.err) {
  //   return res.status(500).send({ msg: clientSave.err });
  // }
  return res.status(200).json({ code: 200, message: 'confirmation success', client: client });
});
//( /user/confirmation/:email/:token) in order to get list of users
router.get('/confirmation/:email/:token',async (req, res) => {
  const  token  = req.params.token;
  // const { email } = req.params.email;
  // Validate user input
  if (!token) {
    return res.status(400).json({ code: 400, message: 'Input is required' });
  }

  // check if user already exist
  // Validate if user exist in our database
  const tokenUser = await Token.findOne({ token: token });

  if (!tokenUser) {
    return res.status(400).json({ code: 400, message: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  // Validate if user exist in our database
  const user = await User.findOne({ _id: tokenUser._clientId, email: req.params.email });

  if (!user) {
    return res.status(400).json({ code: 400, message: 'We were unable to find a user for this verification. Please SignUp!' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  if (user.status == 'true') {
    return res.status(200).send('user has been already verified. Please Login');
  }
  user.status = 'true';
  const userSave = await user.save();
  if (userSave.err) {
    return res.status(500).send({ msg: userSave.err });
  }
  return res.status(200).json({ code: 200, message: 'confirmation success', user: user });
});
//( /user/resendlink) in order to get list of users
router.post('/resendlink', async (req, res) => {
  const  {email}  = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ code: 400, message: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  if (user.status == 'true') {
    return res.status(200).send('This account has been already verified. Please log in.');

  }
  var token = new Token({ _clientId: user._id, token: crypto.randomBytes(16).toString('hex') });
  var error = token.validateSync();
    if (error) {
      return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
      // return res.status(409).send("Validatioan error");
    }
    const teken_save = await token.save();
    const text = 'Hello ' + user.first_name + ',\n\n' + 'Please verify your account again by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n';
    // console.log(text);
    const emaile = sendMail(email, text);
    return res.status(200).json({ code: 200, message: 'resend success', user: user });
});
//( /user/update/:id) in order to update specific user
router.post("/update/:id", async (req, res) => {

  const id = req.params.id;
  //id check
  if (!checkForHexRegExp.test('' + id + '')) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }
  const { first_name, last_name, father_name, email, img_id, name, url, phone, password, role } = req.body;
  // const value = authorSchema.validate(req.body);
  const newValues = {
    first_name: first_name,
    last_name: last_name,
    father_name: father_name,
    email: email.toLowerCase(), // sanitize: convert email to lowercase
    phone: phone,
    img_id: img_id,
    role: role
  };

  const baseuser = new User(newValues);
  // validation
  const error = baseuser.validateSync();
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
  // const user = await user.findOne({ _id: id }, (err, user) => {
  //   user.img.name(name);
  // });
  // const img = await user.find({ _id: id });

  // console.log(img.img[0]);
  // if (img.img[0].name != name) {
  //   newValues.img = { name: name, url: url }
  // }

  // this only needed for development, in deployment is not real function
  const user = await User.findOneAndUpdate({ _id: id }, newValues);

  if (user.err) {
    return res.status(500).json({ code: 500, message: 'There as not any users yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'user exist and updated', olduser: user })
  };
});
//( /user/delete/:id) in order to delete specific user
router.delete("/delete/:id", async (req, res) => {

  const id = req.params.id;

  if (!checkForHexRegExp.test('' + id + '')) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }

  // this only needed for development, in deployment is not real function
  const user = await User.findOneAndDelete({ _id: id });
  // console.log(user) 
  if (!user) {
    return res.status(500).json({ code: 500, message: 'There as not any users yet', error: user })
  };
  if (user.err) {
    return res.status(500).json({ code: 500, message: 'There as not any users yet', error: user })
  }
  else {
    return res.status(200).json({ code: 200, message: 'user exist and deleted', deleted_user: user })
  };
});
//( /getone/:id) in order to get specific client
router.get("/getone/:id", async (req, res) => {

  const id = req.params.id;
  // id valid chech
  if (!checkForHexRegExp.test(id)) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }
  // console.log(req)
  // userLogger.info(req.header)
  // this only needed for development, in deployment is not real function
  const user = await User.find({ _id: id });

  if (user.err) {
    return res.status(500).json({ code: 500, message: 'There as not any users yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'user exist', user: user })
  };
});
//( /auth/:id) in order to get specific user
router.patch("/auth/:id", async (req, res) => {

  const id = req.params.id;
  // id valid chech
  if (!checkForHexRegExp.test(id)) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }
  // console.log(req)
  // userLogger.info(req.header)
  // this only needed for development, in deployment is not real function
  const user = await User.findOneAndUpdate({ _id: id }, { status: "verified" });

  if (user.err) {
    return res.status(500).json({ code: 500, message: 'There as not any users yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'user exist', user: user })
  };
});
module.exports = router;
