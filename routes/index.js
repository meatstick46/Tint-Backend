const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require("../config/auth")
// Welcome Page
router.get("/", (req, res) => {
  res.render("index")
})

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => 
res.render("dashboard", {
    name: req.user.name
}));

// Contact Page
router.get("/contact", (req, res) => {
  res.render("contact")
})
// Gallery Page
router.get("/reviews", (req, res) => {
  res.render("reviews")
})
// Reviews Pages
router.get("/reviews", (req, res) => {
  res.render("reviews")
})



module.exports = router