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
const Client = require("../db/models/client");
const Token = require("../db/models/tokenScheme");
const sendMail = require("../helpers/sendemail")

//request limitter
// const createAccountLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minut window
//   max: 5, // start blocking after 5 requests
//   message:
//     "Too many accounts created from this IP, please try again after an hour"
// });

// const clientSchema = Joi.object({
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

//( /client/register) in order to register client
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
    const oldUser = await Client.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ code: 400, message: 'User Already Exist. Please Login' });
      // return res.status(409).send("User Already Exist. Please Login");
    }
    var code = Math.floor(1000 + Math.random() * 9000);
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //client validated
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
    // const img = new clientSchema({ name: name,url: url})
    // Create client in our database
    //add image if it exist
    // if (name || url) {
    //   value.img = { name: name, url: url }
    // }
    const baseclient = new Client(value);
    // validation
    var error = baseclient.validateSync();
    if (error) {
      return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
      // return res.status(409).send("Validatioan error");
    }
    const client = await baseclient.save();

    // console.log(emaile)
    // Create token
    const token = jwt.sign(
      { client_id: client._id, role: client.role },
      "123456",
      {
        expiresIn: "2h",
      }
    );
    var tokenn = new Token({ _clientId: client._id, token: crypto.randomBytes(16).toString('hex') });
    // validation
    var error = tokenn.validateSync();
    if (error) {
      return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
      // return res.status(409).send("Validatioan error");
    }
    const tekennn = await tokenn.save();
    const text = 'Hello ' + client.first_name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/client/confirmation\/' + client.email + '\/' + tekennn.token + '\n\nThank You!\n';
    // console.log(text);
    const emaile = sendMail(email, text);
    // save user token
    client.token = token;
    // if (name && url) {
    //   client.img = { name: name, url: url }
    // }
    // return new user
    res.status(201).json(client);
  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
  // Our register logic ends here
});
//( /client/login) in order to login client
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
    const client = await Client.findOne({ email:email,status:'true' });

    if (client && (await bcrypt.compare(password, client.password))) {
      // Create token
      const token = jwt.sign(
        { client_id: client._id, role: client.role },
        "123456",
        {
          expiresIn: "2h",
        }
      );

      // save user token
      client.token = token;

      // user
      return res.status(200).json(client);
    }
    return res.status(200).json({ code: 200, message: 'Client does not exist and not verified' });
  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
  // Our register logic ends here
});
//( /client/list) in order to get list of clients
router.post("/list", async (req, res) => {
  let { pageNumber, pageSize } = req.body;
  pageNumber = parseInt(pageNumber);
  pageSize = parseInt(pageSize);
  // this only needed for development, in deployment is not real function
  try {

    const client = await Client.find()
    .skip((pageNumber - 1) * pageSize) 
    .limit(pageSize)           
    .sort({ first_name: 1 });
    // console.log(client)
    return res.status(202).json({ code: 202, list_of_clients: client });

  } catch (err) {
    userLogger.error(err);
    // console.log(err);
  }
});
//( /client/confirmation/:email/:token) in order to get list of clients
router.get('/confirmation/:email/:token',async (req, res) => {
  const  token  = req.params.token;
  // const { email } = req.params.email;
  // Validate user input
  if (!token) {
    return res.status(400).json({ code: 400, message: 'Input is required' });
  }

  // check if user already exist
  // Validate if user exist in our database
  const tokenClient = await Token.findOne({ token: token });

  if (!tokenClient) {
    return res.status(400).json({ code: 400, message: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  // Validate if user exist in our database
  const client = await Client.findOne({ _id: tokenClient._clientId, email: req.params.email });

  if (!client) {
    return res.status(400).json({ code: 400, message: 'We were unable to find a client for this verification. Please SignUp!' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  if (client.status == 'true') {
    return res.status(200).send('Client has been already verified. Please Login');
  }
  client.status = 'true';
  const clientSave = await client.save();
  if (clientSave.err) {
    return res.status(500).send({ msg: clientSave.err });
  }
  return res.status(200).json({ code: 200, message: 'confirmation success', client: client });
});
//( /client/resendlink) in order to get list of clients
router.post('/resendlink', async (req, res) => {
  const  {email}  = req.body;
  const client = await Client.findOne({ email: email });
  if (!client) {
    return res.status(400).json({ code: 400, message: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    // return res.status(409).send("User Already Exist. Please Login");
  }
  if (client.status == 'true') {
    return res.status(200).send('This account has been already verified. Please log in.');

  }
  var token = new Token({ _clientId: client._id, token: crypto.randomBytes(16).toString('hex') });
  var error = token.validateSync();
    if (error) {
      return res.status(409).json({ code: 409, message: 'Validatioan error', error: error });
      // return res.status(409).send("Validatioan error");
    }
    const teken_save = await token.save();
    const text = 'Hello ' + client.first_name + ',\n\n' + 'Please verify your account again by clicking the link: \nhttp:\/\/' + req.headers.host + '\/client/confirmation\/' + client.email + '\/' + token.token + '\n\nThank You!\n';
    // console.log(text);
    const emaile = sendMail(email, text);
    return res.status(200).json({ code: 200, message: 'resend success', client: client });
});
//( /client/update/:id) in order to update specific client
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

  const baseclient = new Client(newValues);
  // validation
  const error = baseclient.validateSync();
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
  // const client = await Client.findOne({ _id: id }, (err, client) => {
  //   client.img.name(name);
  // });
  // const img = await Client.find({ _id: id });

  // console.log(img.img[0]);
  // if (img.img[0].name != name) {
  //   newValues.img = { name: name, url: url }
  // }

  // this only needed for development, in deployment is not real function
  const client = await Client.findOneAndUpdate({ _id: id }, newValues);

  if (client.err) {
    return res.status(500).json({ code: 500, message: 'There as not any clients yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'Client exist and updated', oldclient: client })
  };
});
//( /client/delete/:id) in order to delete specific client
router.delete("/delete/:id", async (req, res) => {

  const id = req.params.id;

  if (!checkForHexRegExp.test('' + id + '')) {
    return res.status(422).json({
      message: 'Id is not valid',
      error: id,
    });
  }

  // this only needed for development, in deployment is not real function
  const client = await Client.findOneAndDelete({ _id: id });
  // console.log(client) 
  if (!client) {
    return res.status(500).json({ code: 500, message: 'There as not any clients yet', error: client })
  };
  if (client.err) {
    return res.status(500).json({ code: 500, message: 'There as not any clients yet', error: client })
  }
  else {
    return res.status(200).json({ code: 200, message: 'Client exist and deleted', deleted_client: client })
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
  const client = await Client.find({ _id: id });

  if (client.err) {
    return res.status(500).json({ code: 500, message: 'There as not any clients yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'Client exist', client: client })
  };
});
//( /auth/:id) in order to get specific client
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
  const client = await Client.findOneAndUpdate({ _id: id }, { status: "verified" });

  if (client.err) {
    return res.status(500).json({ code: 500, message: 'There as not any clients yet', error: err })
  }
  else {
    return res.status(200).json({ code: 200, message: 'Client exist', client: client })
  };
});
module.exports = router;