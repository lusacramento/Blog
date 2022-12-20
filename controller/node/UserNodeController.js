// Require
const express = require("express");
const router = express.Router();

const userService = require("../../service/UserService");

const isJson = false;

router.get("/register", (req, res) => {
  userService.register(req, res, isJson);
});

router.post("/register", (req, res) => {
  userService.save(req, res, isJson);
});

router.get("/login", (req, res) => {
  userService.login(req, res, isJson);
});

router.post("/auth", (req, res, next) => {
  userService.auth(req, res, next);
});

router.get("/logout", (req, res) => {
  userService.logout(req, res, isJson);
});

module.exports = router;
