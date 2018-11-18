const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname + '/../public'))

//DB
const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true    
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/App', options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to local instance of DB");
});

const {Book} = require('./models/books');
const {Store} = require('./models/stores');

const jsonParser = bodyParser.json();

//POST
app.post('/api/add/store', jsonParser, (req,res)=>{
    
    const store = new Store({       
        name: req.body.name,
        address: req.body.address,
        phone: Number(req.body.phone)
    });
    console.log(req.body)
    store.save((err, doc)=>{
        console.log('in store save')
        if(err) { 
            console.log(err);
            res.status(400).send(err)
         }        
        res.status(200).send();
    })
})

//GET
app.get('/api/stores', (req, res)=>{
    Store.find((err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    })
})

app.get('/api/books', (req, res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let order = req.query.ord ? req.query.ord : 'asc';
    Book.find().sort({_id:order}).limit(limit).exec((err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    })
})


app.get('/api/books/:id',(req,res)=>{
    Book.findById(req.params.id,(err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc)
    })
})

//POST
app.post('/api/add/books', jsonParser, (req, res)=>{
  const book = new Book({
      name : req.body.name,
      author: req.body.author,
      pages: req.body.pages,
      price: req.body.price,
      stores: req.body.stores,
  });
  
  book.save((err,doc)=>{
      if(err) res.status(400).send(err);
      res.status(200).send();
  })
})

//PATCH

app.patch('/api/add/books/:id', jsonParser, (req,res)=>{
    Book.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true}, (err, doc)=>{
        if(err) res.status(400).send(err);
        res.status(200).send();
    });
})

//DELETE
app.delete('/api/delete/books/:id', (req,res)=>{
    Book.findByIdAndRemove(req.params.id, (err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc);
    })
})


//Start server

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
});