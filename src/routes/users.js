const passport = require("passport");
const { Router } =require("express");
const Person = require("../models/person")
const router = Router();

//controlers 
const renderSignUpForm = (req,res) => {
    res.render('users/signUp')
};

const signUp = async(req,res) => {
    let errors = [];
    const { name, email, password, confirm_password } = req.body;
    if (password != confirm_password) {
      errors.push({ text: "Passwords do not match. "});
    }
    if (password.length < 4) {
      errors.push({ text: "Passwords must be at least 4 characters." });
    }
    if (errors.length > 0) {
        res.render("users/signUp", {
            errors,
            name,
            email,
            password,
            confirm_password,
        });
    } else {
      // Look for email coincidence
      const emailUser = await Person.findOne({ email: email });
      if (emailUser) {
          req.flash("error_msg", "The Email is already in use.");
          res.redirect("/signUp");
      } else {
        // Saving a New User
        const newUser = new Person({ Name:name, email: email, password: password });
        try{
            newUser.password = await newUser.encrypPass(password);
        }catch(err){
            console.log(err)
        }
        await newUser.save();
        req.flash("success_msg", "You are registered.");
        res.redirect("/signIn");
      }
    }
};

const renderSignInForm = (req,res) => {
    res.render("users/signIn")
}

const signIn = passport.authenticate("local", {
        successRedirect: "/sit",
        failureRedirect: "/signIn",
        failureFlash: true
});


const logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/signin");
};

//routes
router.get("/signUp",renderSignUpForm)
router.post("/signUp",signUp)

router.get("/signIn",renderSignInForm)
router.post("/signIn",signIn)

router.get("/logout",logout)
 
module.exports =  router;