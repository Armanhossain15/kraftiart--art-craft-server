const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.MD_USER}:${process.env.MD_PASS}@cluster0.rtlua5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const database = client.db('Bizbazaar')
        const BlogCollection = database.collection('BlogCollection')
        const CategoryCollection = database.collection('CategoryCollection')


        app.get('/blogs', async (req, res) => {
            const cursor = BlogCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/categorys', async (req, res) => {
            const cursor = CategoryCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/myblog/:email', async (req, res) => {
            const userEmail = req.params.email
            const query = { authorEmail: userEmail }
            const cursor = BlogCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const cursor = BlogCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/search/:subCategoryName', async (req, res) => {
            const subCategoryName = req.params.subCategoryName
            const query = { subcategory_Name: subCategoryName }
            const cursor = BlogCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/addblogs', async (req, res) => {
            const newBlog = req.body
            // console.log(newBlog);
            const result = await BlogCollection.insertOne(newBlog)
            res.send(result)
        })

        app.post('/addcategorys', async (req, res) => {
            const newcategory = req.body
            // console.log(newBlog);
            const result = await CategoryCollection.insertOne(newcategory)
            res.send(result)
        })

  

        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await BlogCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/items/:id', async (req, res) => {
            const id = req.params.id
            const itemData = req.body
            // console.log(itemData);
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    image: itemData.image,
                    item_name: itemData.item_name,
                    subcategory_Name: itemData.subcategory_Name,
                    rating: itemData.rating,
                    short_description: itemData.short_description,
                    price: itemData.price,
                    customization: itemData.customization,
                    processing_time: itemData.processing_time,
                    stockStatus: itemData.stockStatus,

                }
            }
            const result = await BlogCollection.updateOne(query, updateDoc)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('KraftiArt server is ruuning')
})

app.listen(port, () => {
    console.log(`KraftiArt is running on ${port}`);
})