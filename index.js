const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ny61p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const orders = client.db("emaJohnStore").collection("orders");

  app.post('/addAllProductsToDatabase', (req, res) => {
    const body = req.body;
    productsCollection.insertMany(body).then(result => res.send(result));
  })

  app.get('/getAllProducts', (req, res) => {
    productsCollection.find({}).toArray((error, documents) => res.send(documents));
  })

  app.post('/getProductsByKeys', (req, res) => {
    const keys = req.body;
    productsCollection.find({ key: { $in: keys } }).toArray((error, documents) => res.send(documents));
  })

  app.get('/getProductByKey/:productKey', (req, res) => {
    const { productKey } = req.params;
    productsCollection.find({ key: productKey }).toArray((error, documents) => res.send(documents[0]));
  })

  app.post('/saveOrder', (req, res) => {
    const body = req.body;
    orders.insertOne(body).then(result => res.send(result));
  })

  app.get('/', (req, res) => {
    res.send('Hello World!');
  })

});


app.listen(process.env.PORT || 4000);