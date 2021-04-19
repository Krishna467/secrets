//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/userdb", {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));

const userschema = new mongoose.Schema({
    username :String,
    password : String
});

const secret = "thisisasecret";

userschema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ["password"]});
const users = new mongoose.model("users", userschema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
   
    const username = req.body.username;

    const password = req.body.password;
    
    const usersdetails = new users({
        username : username,
        password : password
    });
    users.find({username : username},
        function(err, foundusers){
            if(!foundusers){
              res.send("users exist");

            }
            else{
                usersdetails.save(function(err){
                    if(!err){
                      res.render("secrets");
                    }
                  });
            }

        });

});

app.post("/login", function(req,res){
    const username = req.body.username;

    const password = req.body.password;

    users.findOne({username : username}, function(err,foundusers){
       if(!err){
        if(foundusers){
            if(foundusers.password === password){
                res.render("secrets");
            }
            else{
                res.send("login failed");
            }
        }
       }
    });
});






app.listen(3000, function(){
    console.log("server started");
});