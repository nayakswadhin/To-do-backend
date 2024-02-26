import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import "dotenv/config";

async function start() {
  try {
    const app = express();
    app.use(
      cors({
        origin: "*",
        optionsSuccessStatus: 200,
        credentials: true,
      })
    );
    const mongo = await MongoClient.connect(
      process.env.MONGODB_URL ? process.env.MONGODB_URL : ""
    );
    //e8kObIIvoyINjC3s
    await mongo.connect();
    app.set("db", mongo.db());

    //body parser
    app.use(
      bodyParser.json({
        limit: "500kb",
      })
    );
    console.log("App is listening to database");

    //Routers
    app.use("/user", require("./routes/user"));
    app.use("/", require("./routes/task"));

    app.listen(process.env.PORT, () => {
      console.log(`APP is listening in port:${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
