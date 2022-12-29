// Require
import express from "express";
const router = express.Router();

import { CategoryService } from "../service/categoryService.js";

router.get("/add", (req, res) => {
  req.flash("errorMessage", "");
  req.flash("successMessage", "");
  res.render("admin/addCategory");
});

router.post("/save", (req, res) => {
  CategoryService.save(req, res);
});
router.post("/remove", (req, res) => {
  CategoryService.remove(req, res);
});

router.get("/edit/:id", (req, res) => {
  CategoryService.findById(req, res);
});

router.post("/:id", (req, res) => {
  CategoryService.alter(req, res);
});

router.get("/:id", (req, res) => {
  CategoryService.findById(req, res);
});

router.get("/", (req, res) => {
  CategoryService.findAll(req, res);
  console.log("teste");
});

export default router;
