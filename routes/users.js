const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require("passport")

const User = require("../models/User")

// Login page
router.get("/login", (req, res) => res.render("login"));

//Register Page
router.get("/register", (req, res) => res.render("register"))

// Contact Page
router.get("/contact", (req, res) => res.render("contact"))

// Gallery Page
router.get("/gallery", (req, res) => res.render("gallery"))

router.get("/reviews", (req, res) => res.render("reviews"))

//Register Handle
router.post("/register", (req, res) => {
    const {name, email, password, password2 } = req.body
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: "Please fill in all fields"})
    }

    //Check passwords match
    if(password !== password2) {
        errors.push({
            msg: "Passwords do not match"
        })
    }

    //Check pass length
    if(password.length < 6) {
        errors.push({msg: "Password should be at least 6 characters long"})
    }

    if(errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
       
        User.findOne({
            email: email
        })
        .then(user => {
            if(user) {
                // If a user exists
                errors.push({ msg: "Email is already registerd" })
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User ({
                    name,
                    email,
                    password
                })
               bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save here
                    newUser.save()
                        .then(user => {
                            req.flash("success_msg", "You are now registered!")
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
               }))
            }
        });
    }
});

// Login handle 
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
})


// Logout handle
router.get("/logout", (req, res) => {
    req.logout(function(err){
        if(err) { return req.flash('success_msg', 'You are logged out');}
        
        res.redirect("/users/login");
    });
    
    
} )

module.exports = router;