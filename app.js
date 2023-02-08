require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const  _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.set("strictQuery",false);
const url=process.env.DB_URL;
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true,family: 4,});
const postSchema= new mongoose.Schema({
    title:String,
    body:String
});
const Post=mongoose.model("Post",postSchema);
app.get("/",function(req,res){
    Post.find(function(err,posts){
        if(!err){
            res.render("home",{posts: posts});
          }
    });
});
app.get("/about",function(req,res){
    res.render("about");
});
app.get("/contact",function(req,res){
    res.render("contact");
});
app.get("/compose",function(req,res){
    res.render("compose");
});
app.post("/compose",function(req,res){
    const post = new Post({
        title: req.body.postTitle,
        body:req.body.postBody
    });
    post.save();
    res.redirect("/");
});
app.get("/post/:title",function(req,res){
    let reqTitle = req.params.title;
    Post.find({},function(err,posts){
        if(!err){
    posts.forEach(function(post){
        let savedTitle = post.title;
        if(_.lowerCase(reqTitle)  === _.lowerCase(savedTitle)){
            res.render("post", {postTitle: post.title , postBody: post.body});
        };
    });
}
});
});
const port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server is running");
});