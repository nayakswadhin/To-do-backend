import express from "express";
import {
  createUser,
  loginController,
  userName,
} from "../controller/userController";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginController);
router.get("/name", userName);

module.exports = router;
