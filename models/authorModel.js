const mongoose = require('mongoose')
const {Schema} = mongoose
const uniqueValidator = require('mongoose-unique-validator')

const authorSchema = Schema({
    name:{
        type:String,
        required:true
    }
})

authorSchema.plugin(uniqueValidator)

const Author = mongoose.model("Author", authorSchema)

module.exports = Author