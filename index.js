require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// MongoDB models
const Person = require("./models/person");

// Initialize app
const app = express();

// body-parser
app.use(express.json());

// Morgan logging middleware
app.use(morgan("tiny"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
   morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Enable cors
app.use(cors());

// Serve static frontend
app.use(express.static("build"));

// Get all persons from db
app.get("/api/persons", (req, res) => {
   Person.find({}).then((persons) => res.json(persons));
});

// get person by id
app.get("/api/persons/:id", (req, res) => {
   Person.findById(req.params.id).then((person) => res.json(person));
});

// Create person and save to db
app.post("/api/persons", (req, res) => {
   const body = req.body;

   // const checkNameExists = persons.find((p) => p.name === name);

   if (!body.name || !body.number)
      res.status(400).json({ error: "Please provide name and number" });

   // if (checkNameExists)
   //    return res
   //       .status(400)
   //       .json({ error: `Contact with name "${name}" already exists` });

   const person = new Person({
      name: body.name,
      number: body.number,
   });

   person.save().then((savedPerson) => res.json(savedPerson));
});

app.delete("/api/persons/:id", (req, res) => {
   const requestedId = Number(req.params.id);
   persons = persons.filter((person) => person.id !== requestedId);
   res.status(204).end();
});

// Phonebook info route
app.get("/info", (req, res) => {
   const requestReceivedAt = new Date();
   res.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${requestReceivedAt}</p>`
   );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
   console.log(`Server running at http://localhost:${PORT}`)
);
