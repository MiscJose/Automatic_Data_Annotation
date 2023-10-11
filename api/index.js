// express
const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const fs = require("fs");
const port = 3000;

// corser: allowing client side to connect
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
  //access-control-allow-credentials:true
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// mongoDB
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const User = require("./models/User.js");
const Data = require("./models/Data.js");

// encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// jsonwebtoken: sending cookie response
const jwt = require("jsonwebtoken");
const jwtSecret = "asdlkjfoiasejn";

// cookie-parser: reading cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// hanlding Form file uploads
const multer = require("multer");

// mongodb data
// login: react-app
// password: HDgwe3HmaG89S6rJ

app.post("/python", (req, res) => {
  let { formData } = req.body;
  const temp = ["./scripts/annotate.py"];

  formData = temp.concat(formData);

  const spawn = require("child_process").spawn;
  const process = spawn("python", formData);

  process.stdout.on("data", function (data) {
    res.json(JSON.parse(data.toString()));
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uploadMiddleware = multer({ dest: "./" });
app.post("/upload", uploadMiddleware.array("file", 1), (req, res) => {
  const { delimeter } = req.body;
  const { path, originalname } = req.files[0];
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    points = data.toString().split(delimeter)
    res.json(points);
  });
});

app.get("/account", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, cookieUserData) => {
    const { id } = cookieUserData;
    res.json(await Data.find({ owner: id }));
  });
});

app.post("/file", (req, res) => {
  const { title, data } = req.body;

  const fileName = "temp" + ".json";
  const filePath = path.join(__dirname, fileName);

  fs.writeFile(fileName, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
    }

    res.sendFile(filePath);
  });

  // need to figure out how to delete
  fs.writeFile(fileName, "", (err) => {
    if (err) {
      console.error(err);
    }
  });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = User.create({
      name,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    //duplicate email
    res.status(422).json(e);
  }
});

app.post("/data", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
  const { title, points, labels, confidence, annotation, model } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, cookieUserData) => {
    if (err) throw err;
    const dataDoc = await Data.create({
      owner: cookieUserData.id,
      title,
      points,
      labels,
      confidence,
      annotation,
      model,
    });
    res.json(dataDoc);
  });
});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const validPassword = bcrypt.compareSync(password, userDoc.password);
    if (validPassword) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("Incorrect Password");
    }
  } else {
    res.status(401).json("User Not Found");
  }
});

app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, cookieUserData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(cookieUserData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
