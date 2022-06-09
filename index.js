const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xc0o0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("Users");
    const usersCollection = db.collection("usersCollection");

    // API to Run Server
    app.get("/", async (req, res) => {
      res.send("Smart Database Server Running");
    });

    //API to get all users
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.send(users); 
    });

    //SPI to get users by page size and page number in params
    app.get("/users/:pageSize/:pageNumber", async (req, res) => {
      const pageSize = parseInt(req.params.pageSize);
      console.log(pageSize);
      const pageNumber = parseInt(req.params.pageNumber);
      console.log(pageNumber);
      const users = await usersCollection
        .find({})
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize)
        .toArray();
      res.send(users);
    });

    //API to get number of users
    app.get("/users/count", async (req, res) => {
      const count = await usersCollection.countDocuments();
      res.send({ count }); 
    });
  } finally {
    // client.close();
  }
};

run().catch(console.dir);

app.listen(port, () => console.log(`Listening on port ${port}`));
