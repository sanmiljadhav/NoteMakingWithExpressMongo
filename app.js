require('dotenv').config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./server/database/connections");
var app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//app.use(express.static(path.join(__dirname,"static")))
//app.use('/',require(path.join(__dirname,'routes/blog.js')))

const template_path = path.join(__dirname, "./templates/views");

connectDB();

//form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set the view engine to ejs
//app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", template_path);

app.use("/", require('./server/routes/router'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
