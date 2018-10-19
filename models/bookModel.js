const mongoose = require('mongoose')
const {Schema} = mongoose
const uniqueValidator = require('mongoose-unique-validator')

const bookSchema = Schema({
    title:{
        type:String,
        unique:true,
        required: true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"Author",
        required: true
        // validate: {
        //     validator(authorID){
        //         return Author.findByID(authorID)
        //     }
        // }
    }
})

bookSchema.plugin(uniqueValidator)

const Book = mongoose.model('Book',bookSchema)

module.exports = Book