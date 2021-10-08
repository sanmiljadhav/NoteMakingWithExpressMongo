const jwt = require("jsonwebtoken");
const Register = require("../model/model");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      const verifyUser = jwt.verify(
        token,
        process.env.SECRET_KEY,
        (err, decodedToken) => {
          if (err) {
            console.log(err.message);
            res.redirect("/login");
          } else {
            console.log("hello o", decodedToken);
            a = decodedToken._id;
            Register.findOne({ _id: a })
              .then((data) => {
                u = data;
                console.log("Saaaaaaaaa");
              })
              .catch((err) => console.log(err));

            res.locals.user = a;
            req.token = token;
            
            req.user = u;

            //res.redirect("/userprofile");
            next();
          }
        }
      );
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = { auth };
