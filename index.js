const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());


const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
});

const BookModel = mongoose.model("Book", bookSchema);


app.get("/book", async (req, res) => {
try{
const bookList = await BookModel.find();
	res.status(200).json(bookList);
}catch(err){
	res.status(400).json({error:err.message});
}
})

app.post("/book", async (req, res) => {
  try {
    if (!req.body.bookName) {
      return res.status(400).json({ error: "bookname is required" });
    }

    const newBook = await BookModel.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/book/:id", async (req, res) => {
try{
const {id}= req.params;
if(!id){
	return res.status(400).json({ error: "book id is required" });
}
const abook = await BookModel.findById(id);
if(!abook){
	return res.status(404).json({ error: "Book not found" });
}
	res.status(200).json(abook);
}catch(err){
	res.status(400).json({error:err.message});
}
});

function check(param,res){
if(!param.val){
	return res.status(400).json({ error: `book ${param.key} is required chk` });
}
}


app.put("/book/:id",async(req,res)=>{
try{
const {id} = req.params;
if(!id){
	return res.status(400).json({ error: `book id is required chk` });
}
const abook = await BookModel.findByIdAndUpdate(id,req.body,{new:true});
if(!abook){
	return res.status(404).json({ error: "Book not found" });
}
	res.status(200).json(abook);

}catch(err){
	res.status(400).json({error:err.message});
}
	
	
});


app.delete("/book/:id", async (req, res) => {
try{
const {id}= req.params;
if(!id){
	return res.status(400).json({ error: "book id is required" });
}
const deleteBook = await BookModel.findByIdAndDelete(id);
if(!deleteBook){
	return res.status(404).json({ error: "Book not found" });
}
	res.status(200).json({message:"Book deleted"});
}catch(err){
	res.status(400).json({error:err.message});
}
});


mongoose
  .connect(process.env.CONNECTION_STR)
  .then(() => {
    console.log("DB connected");

    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((err) => console.log(err));
