const mongoose = require("mongoose");

if (process.argv.length < 3) {
   console.log(
      "Please provide the password as an argument: node mongo.js <password>"
   );
   process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://gagan:${password}@cluster0.qntok.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
   name: String,
   number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
   name: process.argv[3],
   number: process.argv[4],
});

if (process.argv.length > 3) {
   person.save().then((result) => {
      console.log(`Added ${process.argv[3]} ${process.argv[4]} to phonebook`);
      mongoose.connection.close();
   });
} else {
   Person.find({}).then((result) => {
      result.map((person) => console.log(person.name, person.number));
      mongoose.connection.close();
   });
}
