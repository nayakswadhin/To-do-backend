import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controller/taskController";

const router = express.Router();

router.post("/tasks", createTask);
router.get("/tasks", getTask);
router.put("/tasks/:taskid", updateTask);
router.delete("/tasks/:taskid", deleteTask);
router.get("/health", (req, res) => {
  res.status(200).json({ health: "good" });
});

module.exports = router;
