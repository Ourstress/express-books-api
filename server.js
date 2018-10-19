const app = require("./app");
const mongoose = require('mongoose')
const dbUrl = process.env.MONGODB_URI

mongoose.connect(dbUrl, {useNewUrlParser:true})
const db = mongoose.connection

db.on("error", error => {
  console.error("An error occured", error)
})

db.once("open", () => {
  console.log("database is connected!")
})

app.listen(4000, ()=> {
  console.log("Listening on port 4000...")
})