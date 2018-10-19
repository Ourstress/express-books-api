const express = require("express");
const router = express.Router();
const Book = require('../models/bookModel')

/* GET books listing. */
router.get("/", async (req,res,next)=>{
  try{
      const searchResults = await Book.find().populate("author")
      res.status(200).json(searchResults)
  }catch(error){
      next(error)
  }
})

router.post("/", async (req,res,next)=>{
  try{
      const newBook = new Book(req.body)
      await newBook.save()
      res.status(201).json(`new book added - ${newBook}`)
  }catch(error){
      next(error)
  }
})

router.put("/:name", async (req,res,next)=>{
  try{
      const updatedBook = await Book.findOneAndUpdate({name:req.params.name},req.body,{new:true})
      res.status(200).json(updatedBook)
  }catch(error){
      next(error)
  }
})

router.delete("/:name", async (req,res,next)=>{
  try{
      const deletedBook = Book.findOneAndDelete({name:req.params.name}).then(deletedBook=>{
          (deletedBook===null) ? res.status(404).json("book not found") :
          res.status(200).json(`you have deleted book ${req.params.name}`)
      })
  }catch(error){
      next(error)
  }
})

router.get("/:id", async (req,res,next)=>{
  try{
      const books = await Book.find({author:req.params.id})
      res.status(200).json(books)
   } catch(error){
          next(error)
      }
  }
)
module.exports = router;
