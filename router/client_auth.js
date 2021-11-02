const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Client = require("../db/models/client");
const Joi = require('joi');
const bcrypt=require('bcrypt')
// const multer=require('multer')


const blogSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(200)
    .required(),
  about: Joi.string()
    .min(10)
    .max(200),
  source: Joi.string()
    .min(10)
    .max(200)
});
// const upload = multer({ dest: "public/files" });
router.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, father_name, email,name,url, phone, password, role } = req.body;
    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Client.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    //genrrating img url
    // const img = upload.single("myFile")
    // const img = new clientSchema({ name: name,url: url})
    // Create client in our database
    const client = await Client.create({
      first_name,
      last_name,
      father_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      phone,
      password: encryptedPassword,
      role
    });

    // Create token
    const token = jwt.sign(
      { client_id: client._id, email },
      "123456",
      {
        expiresIn: "2h",
      }
    );
    // save user token
    client.token = token;
    client.img={ name: name,url: url}
    // return new user
    res.status(201).json(client);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
router.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const client = await Client.findOne({ email });

    if (client && (await bcrypt.compare(password, client.password))) {
      // Create token
      const token = jwt.sign(
        { client_id: client._id, email },
        "123456",
        {
          expiresIn: "2h",
        }
      );

      // save user token
      client.token = token;

      // user
      res.status(200).json(client);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
module.exports = router;