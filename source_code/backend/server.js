/* MY IMPORTS */
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const port = process.env.PORT || 8080;
require("dotenv").config();
const multer = require("multer");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const request = require("request");

/* MY SCHEMAS */
const User = require("./user");
const { default: Axios } = require("axios");

// AWS S3 Bucket Connection and Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("image");

// MongoDB Connecting
mongoose.connect(
  process.env.MONGODB_CONNECT_LINK,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (error) => {
    if (error) {
      throw error;
    }
    console.log("Connected to MongoDB Atlas Database");
  }
);

// CORS and Express JSON Middleware
app.use(express.json());

/*
  (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
}
 */
app.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "Authorization",
      "Origin",
      "Content-Type",
      "x-auth-token",
      "Accept",
    ],
  })
);

/* Authentication function to validate JWT Token to get User Data */
const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res
        .status(401)
        .send({ message: "No authentication token, authorization denied." });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res
        .status(401)
        .send({ message: "Token verification failed, authorization denied." });
    }

    req.user = verified.id;
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

/* ENDPOINTS / ROUTES */

// JWT Token Validation Endpoint
app.post("/validToken", async (req, res) => {
  try {
    const jwtToken = req.header("x-auth-token");

    if (!jwtToken) {
      return res.send(false);
    }

    const verifiedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (!verifiedToken) {
      return res.send(false);
    }

    const user = await User.findById(verifiedToken.id);

    if (!user) {
      return res.send(false);
    }

    return res.send(true);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Login Route verifies Login Process
app.post("/login", async (req, res) => {
  try {
    const reqUser = req.body;
    if (!reqUser.username || !reqUser.password) {
      return res.status(400).send({ message: "Empty Fields!" });
    }

    const user = await User.findOne({ username: reqUser.username });
    if (!user) {
      return res
        .status(400)
        .send({ message: "No account with this username exists." });
    }

    const isMatch = await bcrypt.compare(reqUser.password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    // We sign the JWT token for the session
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({
      token: jwtToken,
      user: user,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Register Route creates an account if requirements are met
app.post("/register", async (req, res) => {
  try {
    let reqUser = req.body;

    if (!reqUser.username || !reqUser.password) {
      return res
        .status(400)
        .send({ message: "Not all fields have been entered." });
    }

    if (reqUser.password.length < 4) {
      return res.status(400).send({
        message: "The password needs to be at least 4 characters long.",
      });
    }

    const userExists = await User.findOne({ username: reqUser.username });

    if (userExists) {
      return res
        .status(400)
        .send({ message: "Account with this username already exists." });
    }

    const bcryptSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(reqUser.password, bcryptSalt);

    const newUser = new User({
      username: reqUser.username,
      name: "New User",
      password: hashedPassword,
      image: "jdsbfkdjasbfdkjasbfdkjasbfdlasfkjbaslasfasfklbasfkjbas.png",
      description: "No Description",
    });
    const user = await newUser.save();
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// This User endpoint gets the user requested (Going to be the user logging in)
app.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.status(200).send(user);
});

app.post("/updateDetails", upload, async (req, res) => {
  console.log(req.body);

  await User.updateOne(
    { username: req.body.username },
    {
      image: req.body.imageName,
      name: req.body.name,
      description: req.body.description,
    }
  );
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {});
  res.status(200).send("Details Updated!");
});

app.get("/", async (req, res) => {
  const allUsers = await User.find({});
  res.status(200).send(allUsers);
});

app.get("/api/pokemon", (req, res) => {
  request(
    "http://pokeapi.co/api/v2/pokemon/" + req.query.pokemonName,
    (err, response, body) => {
      if (!err && response.statusCode === 200) {
        res.status(200).send(body);
      } else {
        res.status(200).send({ message: "Please Enter Valid Pokemon Name!" });
      }
    }
  );
});

app.get("/findUserById", async (req, res) => {
  const doc = await User.findById(req.query.id);
  res.status(200).send(doc);
});

// Listening to the port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
