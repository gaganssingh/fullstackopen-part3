const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
   .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
   .then((result) => console.log("Connected to MongoDB"))
   .catch((error) => console.log("Error connecting t MongoDB", error.message));

const personSchema = new mongoose.Schema({
   name: String,
   number: String,
});

// Changes default returned json object
//  to have "id" instead of "_id" and deletes "__v"
personSchema.set("toJSON", {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

module.exports = mongoose.model("Person", personSchema);
