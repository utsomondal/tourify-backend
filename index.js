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

// Connect mongodb
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@learning-cluster.4pttlh7.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGODB_CLUSTER}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Country data
const countries = [
  {
    "country_Name": "France",
    "imageURL": "https://frenchmoments.eu/wp-content/uploads/2013/10/Paris-%C2%A9-French-Moments-Tour-Eiffel-Structure-01.jpg",
    "description": "France is famous for its rich history, art, cuisine, and the iconic Eiffel Tower."
  },
  {
    "country_Name": "Italy",
    "imageURL": "https://cdn.britannica.com/36/162636-050-932C5D49/Colosseum-Rome-Italy.jpg",
    "description": "Italy offers stunning architecture, delicious food, and ancient ruins like the Colosseum."
  },
  {
    "country_Name": "Spain",
    "imageURL": "https://www.cuddlynest.com/blog/wp-content/uploads/2020/09/sagrada-familia-most-beautiful-buildings-world-1030x713.jpg",
    "description": "Spain is known for vibrant festivals, beautiful beaches, and historic cities like Barcelona."
  },
  {
    "country_Name": "England",
    "imageURL": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/63/f8/bb/big-ben.jpg?w=900&h=500&s=1&pcx=1033&pcy=310&pchk=v1_bf93e1170e1f1f8d4cea",
    "description": "England boasts famous landmarks like Big Ben, Buckingham Palace, and a rich literary history."
  },
  {
    "country_Name": "Switzerland",
    "imageURL": "https://images.ctfassets.net/m5us57n7qfgl/7f8rGhMALJTU39GoyBXSEo/e1a7ed9ceec7f633459df2e34d6a8f67/image-1.jpg?w=1200&h=630&fm=jpg&q=70&f=center",
    "description": "Switzerland is famous for its breathtaking Alps, chocolates, and luxury watches."
  },
  {
    "country_Name": "Netherlands",
    "imageURL": "https://static.vecteezy.com/system/resources/previews/032/492/435/large_2x/colorful-tulips-and-windmill-in-holland-spring-landscape-landscape-with-tulips-in-zaanse-schans-netherlands-europe-ai-generated-free-photo.jpg",
    "description": "The Netherlands is known for its windmills, tulip fields, canals, and vibrant cities like Amsterdam."
  }
]


async function run() {
  try {
    await client.connect();
    const database = client.db('tourifyDB');
    const touristSpotCollection = database.collection('touristSpots');
    const countriesCollection = database.collection('countries');
    const count = await countriesCollection.countDocuments();
    if (count === 0) {
      await countriesCollection.insertMany(countries);
    }

    app.get('/', (req, res) => {
      res.send('Tourify server is running');
    });

    app.get('/countries', async (req, res) => {
      const allCountries = await countriesCollection.find().toArray();
      res.send(allCountries);
    });

    app.post('/my-spots', async (req, res) => {
      const { email } = req.body;
      const query = { userEmail: email };
      const touristSpot = await touristSpotCollection.find(query).toArray();
      res.send(touristSpot);
    });

    app.post('/spots-by-country', async (req, res) => {
      const { country_Name } = req.body;
      const query = { countryName: country_Name };
      const touristSpots = await touristSpotCollection.find(query).toArray();
      res.send(touristSpots);
    });

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
    });

    app.delete("/my-spots/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const deleteSpot = await touristSpotCollection.deleteOne(query);
      res.send(deleteSpot);
    });

    app.put('/update-tourist-spot/:id', async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      if ('_id' in data) {
        delete data._id;
      }

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: data,
      };

      const options = { upsert: true };

      const result = await touristSpotCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

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
