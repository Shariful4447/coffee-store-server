const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000 ;


//database connection
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5wr47xq.mongodb.net/?retryWrites=true&w=majority`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const userCollection = client.db('coffeeDB').collection('user');

    app.get('/coffee', async (req, res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    })
// post coffee or create coffe
    app.post('/coffee', async (req, res) => {
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    })
// create USER in db
    app.post('/user', async (req, res) => {
        const newUser = req.body;
        console.log(newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    })

    // get user List
    app.get('/user', async (req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.put('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert : true};
        const updatedCoffee = req.body;
        const coffee = {
            $set : {
                name: updatedCoffee.name, 
                quatity: updatedCoffee.quatity, 
                supplier: updatedCoffee.supplier, 
                taste: updatedCoffee.taste,
                category: updatedCoffee.category, 
                details: updatedCoffee.details, 
                image: updatedCoffee.image
            }
        }

        const result = await coffeeCollection.updateOne(filter, coffee, options)
        res.send(result);
    })

    app.delete('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
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


//middle ware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Coffee making server');
})

app.listen(port, ()=>{
    console.log(`coffee making server is running : ${port}`);
})
