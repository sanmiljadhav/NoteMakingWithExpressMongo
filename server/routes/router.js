const express = require("express");

//var app = require("../../app")

const route = express.Router();
const bcrypt = require("bcryptjs");

const Register = require("../model/model");
const Addnote = require("../model/addnote");
const Sharedwith = require("../model/sharedwith");
const mongoose = require("mongoose");
const { auth } = require("../middleware/auth");

route.get("/", (req, res) => {
  res.render("index");
});

route.get("/login", (req, res) => {
  res.render("userlogin");
});

route.post("/login", async (req, res) => {
  try {
    const email = req.body.emailid;
    const password = req.body.pwd;
    const useremail = await Register.findOne({ email: email });
    //if(!useremail){
    //return res.json({status:'error',error:'Invalid Username or Password'})
    //}

    const isMatched = await bcrypt.compare(password, useremail.password); //It returns Boolean Value
    console.log("is matched", isMatched);

    const token = await useremail.generateAuthToken();
    console.log("The token part" + token);

    //login karneke baad cookie ko store kar do
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
      //secure:true
    });

    if (isMatched) {
      console.log(useremail);
      idd = useremail._id;
      res.redirect("/userprofile");
    } else {
      res.send("Invalid login details");
    }
  } catch (error) {
    res.status(400).send("Login Unsuccessfull, Please Try Again");
  }
});

route.get("/register", (req, res) => {
  res.render("userregister");
});

route.post("/register", async (req, res) => {
  try {
    if (!req.body.firstname || typeof req.body.firstname !== "string") {
      return res.json({ status: "error", error: "Invalid name" });
    }

    if (!req.body.emailid || typeof req.body.emailid !== "string") {
      return res.json({ status: "error", error: "Invalid email" });
    }

    if (!req.body.password || typeof req.body.password !== "string") {
      return res.json({ status: "error", error: "Invalid password" });
    }

    const registerUser = new Register({
      name: req.body.firstname,
      email: req.body.emailid,
      password: req.body.password,
    });

    const token = await registerUser.generateAuthToken();
    console.log(token);
    //the res.cookie() function is used to set the cookie name to value.
    //the value parameter may be string or object converted to json
    //
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
    });

    const register = await registerUser.save();
    res.status(201).redirect("/login");
  } catch (error) {
    res.status(400).send(error);
  }
});

route.get("/userprofile", auth, async (req, res) => {
  //console.log(`This is a cookie ${req.cookies.jwt}`)
  //console.log("I am",req.cookies.jwt);
  console.log("I am", res.locals.user);
  const id = res.locals.user;
  console.log(typeof id);
  const data = await Register.findById({ _id: id });
  console.log(data.name);

  //console.log("data is",data);

  try {
    const ids = [id];
    console.log(ids);

    //finding the Notes of particular user..

    const user = await Addnote.find({ users: { $in: ids } });

    res.render("userprofile", { notes: user, name: data.name });
  } catch (error) {
    console.log(error);
  }
});

route.post("/userprofile", auth, async (req, res) => {
  try {
    //const useremail = await Register.findOne({ email: email });
    const id = res.locals.user;

    notetitle = req.body.notetitle;
    notedesc = req.body.notedesc;

    const addnote = new Addnote();
    addnote.notetitle = notetitle;
    addnote.notedescription = notedesc;
    addnote.users = id;
    const note = await addnote.save();
    console.log("Note added");
    res.status(201).redirect("/userprofile");
  } catch (error) {
    res.status(400).send(error);
  }
});

//update form
route.get("/userprofile/:id", auth, async (req, res) => {
  try {
    id = req.params.id;
    console.log(id);

    const user = await Addnote.findById({ _id: id });

    //console.log(user);
    res.render("noteupdate", { notes: user });
  } catch (error) {
    console.log(error);
  }
});

//update
route.post("/userprofile/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const getNote = await Addnote.findByIdAndUpdate(_id, {
      notetitle: req.body.notetitle,
      notedescription: req.body.notedesc,
    });

    res.redirect("/userprofile");
  } catch (error) {
    console.log(error);
  }
});

//delete
route.post("/delete/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;

    const getNote = await Addnote.findByIdAndDelete(_id);
    console.log(" nte", getNote);

    res.redirect("/userprofile");
  } catch (error) {
    console.log(error);
  }
});

route.get("/sharedwith/:id", auth, async (req, res) => {
  try {
    //Taking User to Not Show That User
    const id = res.locals.user;
    const user = await Register.findById({ _id: id });
    console.log(user.email);

    //Taking Note ID for posting through search User Form
    noteid = req.params.id;
    let note_id = { noteid: noteid };
    console.log(note_id);

    //{email:{$ne:'sunny@gmail.com'}}

    const getusers = await Register.find({ email: { $ne: user.email } });

    //find({ age: { $gte: 30 } })
    console.log(getusers);

    res.render("searchuser.ejs", { users: getusers, noteidd: note_id });
  } catch (error) {
    console.log(error);
  }
});

route.post("/sharedwith/:id", auth, async (req, res) => {
  try {
    console.log("I am post", req.params.id);
    noteid = req.params.id;
    email = req.body.email;
    const user = await Register.findOne({ email: email }); //get sending user from DB
    shareduid = user.id; //get sending user id
    console.log("I am shareduid", shareduid);
    if (email === user.email) {
      //if the user with that email exists

      const shr = await Sharedwith.findOne({
        shareduserid: shareduid,
        noteid: noteid,
      });
      id = res.locals.user; //current user
      console.log("I am userid", id);

      console.log("I am shr", shr);

      if (shr == null) {
        const sharedwith = new Sharedwith({
          shareduserid: shareduid,
          noteid: noteid,
          userid: id,
        });
        const shared = await sharedwith.save();
        console.log("Note shared");
        res.status(201).redirect("/userprofile");
      } else {
        res.send("U cant Share Note to Same User Again");
      }
    } else {
      res.send("U have entered the wrong email of the user which doesnt exist");
    }
  } catch (error) {
    res.send("U cant share same note to the same user again");
    console.log(error);
  }
});

route.get("/sharednotes", auth, async (req, res) => {
  try {
    const userid = res.locals.user;
    console.log(userid);
    console.log(userid);
    const user = await Sharedwith.find({ shareduserid: userid }); //current user ko sharekiye hue notes
    console.log(user);
    let lista = [];
    for (var i = 0; i < user.length; i++) {
      lista.push(user[i].noteid); //take their noteid
    }
    console.log(lista);

    const nots = await Addnote.find({
      _id: { $in: lista },
    });

    res.render("sharednotes", { notes: nots });
  } catch (error) {
    console.log(error);
  }
});

route.get("/logout", auth, async (req, res) => {
  try {
    console.log("from logout", req.user);
    req.user.tokens = req.user.tokens.filter((element) => {
      element.token !== req.token;
    });

    res.clearCookie("jwt");
    await req.user.save();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
