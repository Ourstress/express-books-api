const express = require('express')
const router = express.Router()
const Author = require('../models/authorModel')
const Book = require('../models/bookModel')

router.post("/", async (req,res,next)=>{
    try{
        const newAuthor = new Author(req.body)
        await newAuthor.save()
        res.status(201).json(`new author added - ${newAuthor}`)
    }catch(error){
        next(error)
    }
})

router.get("/", async (req,res,next)=>{
    try{
        const searchResults = await Author.find()
        res.status(200).json(searchResults)
    }catch(error){
        next(error)
    }
})

// router.get("/:name", async (req,res,next)=>{
//     try{
//         const searchResults = await Author.find({name:new RegExp(req.params.name,'gi')})
//         res.status(200).json(searchResults)
//     }catch(error){
//         next(error)
//     }
// })

router.get("/:id", async (req,res,next)=>{
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author:req.params.id})
        res.status(200).json({
            ...author.toJSON,
            books})
     } catch(error){
            next(error)
        }
    }
)

// router.get("/:id", async (req,res,next)=>{
//     try{
//         const books = await Book.find({author:req.params.id})
//         res.status(200).json(books)
//      } catch(error){
//             next(error)
//         }
//     }
// )


router.put("/:name", async (req,res,next)=>{
    try{
        const updatedAuthor = await Author.findOneAndUpdate({name:req.params.name},req.body,{new:true})
        res.status(200).json(updatedAuthor)
    }catch(error){
        next(error)
    }
})

router.delete("/:name", async (req,res,next)=>{
    try{
        Author.findOneAndDelete({name:req.params.name}).then(deletedAuthor=>{
            (deletedAuthor===null) ? res.status(404).json("author not found") :
            res.status(200).json(`you have deleted author ${req.params.name}`)
        })
    }catch(error){
        next(error)
    }
})


module.exports = router;