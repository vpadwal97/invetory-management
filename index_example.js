const express = require("express"); //import express
const mongoose = require("mongoose"); //import mongoose
require("dotenv").config();

// const connectStr = "mongodb+srv://vishu:1432ilu@cluster0.fw0yhqi.mongodb.net/?appName=Cluster0";
const connectStr = process.env.CONNECTION_STR;


const port = 3000; //set port

const app = express();

app.get("/", (req, res) => {
  //path, eun with req, res
  res.send("hello server is startted bro ");
});

app.get("/about", (req, res) => {
  res.send("about page");
});

app.listen(port, () => {
  // start server at port 3000
  console.log(`Server started at port ${port}`);
});


mongoose
  .connect(connectStr)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
