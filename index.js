require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Initializing the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// connect mongodb
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@learning-cluster.4pttlh7.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGODB_CLUSTER}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const database = client.db('tourifyDB');
    const touristSpotCollection = database.collection('touristSpots');

    app.get('/tourist-spot/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const touristSpot = await touristSpotCollection.findOne(query);
      res.send(touristSpot);
    });
    app.get('/all-tourist-spots', async (req, res) => {
      const allTouristSpots = await touristSpotCollection.find().toArray();
      res.send(allTouristSpots);
    });
    app.get('/all-tourist-spots/top', async (req, res) => {
      const allTouristSpots = await touristSpotCollection.find().sort({ totalVisitorsPerYear: -1 }).limit(6).toArray();
      res.send(allTouristSpots);
    });

    app.post("/add-tourist-spot", async (req, res) => {
      const touristSpotData = req.body;
      const result = await touristSpotCollection.insertOne(touristSpotData);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
