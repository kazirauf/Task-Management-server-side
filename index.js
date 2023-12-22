const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7u0ly7l.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const userCollection = client.db("TaskMasterPro").collection("users");
const taskCollection = client.db("TaskMasterPro").collection("taskCreation");

app.post("/users", async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await userCollection.findOne(query);
    if (existingUser) {
      return res.send({ message: "user already exists", insertedId: null });
    }
    const result = await userCollection.insertOne(user);
    res.send(result);
  });
  

  app.get("/myRole", async (req, res) => {
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email };
    }
    const result = await userCollection.findOne(query);
    res.send(result);
  });

  app.post('/taskCreation', async(req, res) => {
    const newTask = req.body;
    const result = await taskCollection.insertOne(newTask)
    res.send(result)
 })

 app.delete('/taskCreation/:id', async(req, res) => {
  
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await taskCollection.deleteOne(query)
  res.send(result);
 })

 app.get("/taskCreation", async(req, res) => {
  const allTask = await taskCollection.find().toArray()
  res.send(allTask)
})
  
app.get("/", (req, res) => {
  res.send("Welcome to our  Task Master Pro");
});
app.listen(port, () => {
  console.log(`Welcome to Task Master Pro ${port}`);
});