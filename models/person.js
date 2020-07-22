const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const url = process.env.MONGODB_URI;

mongoose
   .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
   .then((result) => console.log("Connected to MongoDB"))
   .catch((error) => console.log("Error connecting t MongoDB", error.message));

const personSchema = new mongoose.Schema({
   name: { type: String, minlength: 3, required: true, unique: true },
   number: { type: String, minlength: 8, required: true, unique: true },
});

personSchema.plugin(uniqueValidator);

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
