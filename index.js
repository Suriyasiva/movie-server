const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
app.use(express.json());
app.use(cors({ origin: "*" }));

// const URl = "mongodb://localhost:27017";
// const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL = `mongodb+srv://suriya:${process.env.MONGO_URL}@cluster0.ppha5.mongodb.net`;
const PORT = process.env.PORT;
// console.log("dotenv", process.env.MONGO_URL);
// console.log("dotenv", process.env.PORT);
// const PORT = 5000;
// post method
app.post("/post", async (req, res) => {
  try {
    // step1: connect mongodb
    let connection = await mongoClient.connect(MONGO_URL);
    console.log("mongo connected");
    // step2: connect db from step1 connection
    let db = connection.db("moviedata");
    // select collection from db and do operation
    await db.collection("moviecollection").insertOne(req.body);
    console.log(req.body);
    // close connection
    await connection.close();
    res.status(200).json({ message: "movie posted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});
// get method
app.get("/get", async (req, res) => {
  try {
    // step1: connect mongodb
    let connection = await mongoClient.connect(MONGO_URL);
    // step2: connect db from connection
    let db = connection.db("moviedata");
    // step 3:select collection and do operation
    let moviedata = await db.collection("moviecollection").find().toArray();
    // close connection
    await connection.close();
    res.json(moviedata);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});
// delete method
app.delete("/delete/:id", async (req, res) => {
  try {
    // step1:connect mongodnb
    let connection = await mongoClient.connect(MONGO_URL);
    // step2:select db name
    let db = connection.db("moviedata");
    // step3:slect collection name and do operation
    await db
      .collection("moviecollection")
      .findOneAndDelete(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    // step4 close connection
    await connection.close();
    res.status(200).json({ message: "data deleted" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
});
// edit method get
app.get("/singledata/:id", async (req, res) => {
  try {
    // step1:connect mongodb
    let connection = await mongoClient.connect(MONGO_URL);
    // step2:connect db
    let db = await connection.db("moviedata");
    // step3:select collection and do operation
    let sigleMovie = await db
      .collection("moviecollection")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    // close connection
    await connection.close();
    res.json(sigleMovie);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
});
//edit method put
app.put("/editdata/:id", async (req, res) => {
  try {
    // step1
    let connection = await mongoClient.connect(MONGO_URL);
    // step2
    let db = await connection.db("moviedata");
    // step3
    await db
      .collection("moviecollection")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    // step4
    await connection.close();
    res.status(200).json({ message: "data updated" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
});
app.listen(PORT, () => {
  console.log("server connected in 5000");
});
