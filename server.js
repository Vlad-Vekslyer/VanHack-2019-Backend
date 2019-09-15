const express = require("express")
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Dog = require("./models/Dog");
const User = require("./models/User");
const Walk = require("./models/Walk");
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser:true});

app.use(async function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send("SERVER IS RUNNING");
})

app.get('/api/dogs', async (req, res) => {
  try {
    let dogs = await Dog.find({})
    res.json(dogs)
  } catch(e){
    res.send(e);
  }
});

app.get('/api/dogs/:id/schedule', async (req, res) => {
  try {
    let foundDog = await Dog.findById(req.params.id);
    let walks = await Walk.find({dog: foundDog.id});
    let responseObject = {
      dog: foundDog,
      walks: walks
    }
    res.json(responseObject);
  } catch(e){
    res.send(e);
  }
});

app.get('/api/users/:id/dogs', async (req, res) => {
  User.findById(req.params.id).populate('dogsWalked').exec((err, user) => {
    if(err){
      res.send(err)
    } else {
      res.json(user);
    }
  });
})

app.listen(process.env.PORT, process.env.IP, () => console.log(`Server started on port ${process.env.PORT}`))
