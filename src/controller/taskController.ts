import Express from "express";
import { Db, ObjectId } from "mongodb";

type Task = {
  title?: string;
  description?: string;
  taskDate?: string;
  isComplete?: boolean;
};

export async function createTask(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { userid } = req.headers;
    const { title, description, taskDate } = req.body;
    const currentDate = new Date();
    const createDate = currentDate.toLocaleDateString();
    const isComplete = false;

    if (!title) {
      return res.status(200).json({ message: "Title required!!" });
    }
    if (!description) {
      return res.status(200).json({ message: "Description required!!" });
    }
    if (!taskDate) {
      return res.status(200).json({ message: "TaskDate required!!" });
    }

    const newTask = await db.collection("task").insertOne({
      title,
      description,
      taskDate,
      createDate,
      isComplete,
      userid,
    });

    if (newTask.acknowledged) {
      return res.status(200).json({
        message: "New task created succefully",
        title,
        description,
        taskDate,
        createDate,
        userid,
        isComplete,
        _id: newTask.insertedId,
      });
    }
    return res.status(400).json({ message: "Invalid Inputs" });
  } catch (error: any) {
    return res.status(200).json({ error: error.toString() });
  }
}

export async function getTask(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { userid } = req.headers;
    const userTasks = await db
      .collection("task")
      .find({ userid: userid })
      .toArray();
    if (userTasks.length) {
      return res.status(200).json({ userTasks });
    }
    return res.status(400).json({ message: "Invalid Input" });
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}

export async function updateTask(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { taskid } = req.params;
    const { title, description, taskDate, isComplete } = req.body;

    const updateTask: Task = {};
    if (title) {
      updateTask.title = title;
    }
    if (description) {
      updateTask.description = description;
    }
    if (taskDate) {
      updateTask.taskDate = taskDate;
    }
    if (typeof isComplete !== "undefined" && isComplete !== null) {
      updateTask.isComplete = isComplete;
    }

    const task = await db
      .collection("task")
      .updateOne({ _id: new ObjectId(taskid) }, { $set: updateTask });

    if (task.matchedCount) {
      const updatedTask = await db
        .collection("task")
        .findOne({ _id: new ObjectId(taskid) });

      return res
        .status(200)
        .json({ message: "Sucessfully Updated", updatedTask });
    }
    return res.status(400).json({ message: "Invalid Input" });
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}

export async function deleteTask(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { taskid } = req.params;

    const deleteTask = await db
      .collection("task")
      .deleteOne({ _id: new ObjectId(taskid) });
    if (deleteTask.deletedCount) {
      return res.status(200).json({ message: "Task deleted Sucessfully" });
    }
    return res.status(400).json({ message: "Invalid Taskid" });
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}
