import { Db, ObjectId } from "mongodb";
import Express from "express";

export async function createUser(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { emailId, name, password } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!name) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const existingUser = await db
      .collection("user")
      .findOne({ emailId: emailId });
    if (existingUser) {
      return res.status(400).json({ message: "EmailId already exist." });
    }

    const newuser = await db
      .collection("user")
      .insertOne({ emailId, name, password });

    if (newuser.acknowledged) {
      return res.status(200).json({ message: "user created sucessfully" });
    }
    return res.status(400).json({ message: "user not created" });
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}

export async function loginController(
  req: Express.Request,
  res: Express.Response
) {
  try {
    const db: Db = req.app.get("db");
    const { emailId, password } = req.body;
    const user = await db.collection("user").findOne({ emailId: emailId });

    if (user) {
      const userId = user._id.toString();
      const name = user.name;
      if (password == user.password) {
        return res.status(200).json({
          message: "Successfully Logged In",
          userId: userId,
          name: name,
        });
      }
      return res.status(404).json({ message: "Incorrect Password" });
    }
    return res.status(400).json({ message: "User Not Found" });
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}

export async function userName(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { userid } = req.headers;
    const userId = Array.isArray(userid) ? userid[0] : userid;
    console.log(userId);

    const user = await db
      .collection("user")
      .findOne({ _id: new ObjectId(userId) });
    if (user) {
      return res
        .status(200)
        .json({ message: "User Found Successfully", userName: user.name });
    } else {
      return res.status(404).json({ message: "User not Found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}
