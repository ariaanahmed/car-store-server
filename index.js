const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.jvx2mqj.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productsCollection = client.db("toyMarket").collection('products');
        const toyCollection = client.db("toyMarket").collection('toys');

        // Find a Document
        app.get('/tabs', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/tabs/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(result)
          })

          
          app.post('/addatoy', async(req, res) => {
              const newToy = req.body;
              console.log(newToy)
              const result = await toyCollection.insertOne(newToy)
              res.send(result)
            })
            
            app.get('/addatoy', async(req, res) => {
                const cursor = toyCollection.find();
                const result = await cursor.toArray();
                res.send(result)
            })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('TOY SERVER IS RUNNING')
})

app.listen(port, () => {
    console.log(` the server is running on port ${port}`)
})