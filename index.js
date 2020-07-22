require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person"); // Imported MongoDB models

const app = express(); // Initialize app

// MIDDLEWARES
app.use(express.json()); // body-parser
app.use(morgan("tiny")); // Morgan logging middleware
morgan.token("body", (req, res) => JSON.stringify(req.body)); // Custom Morgan Logger
app.use(
   morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(cors()); // Enable cors
app.use(express.static("build")); // Serve static frontend

// ROUTES
// Get all persons from db
app.get("/api/persons", (req, res) => {
   Person.find({}).then((persons) => res.json(persons));
});

// Get person by id
app.get("/api/persons/:id", (req, res) => {
   Person.findById(req.params.id).then((person) => res.json(person));
});

// Create new person
app.post("/api/persons", (req, res) => {
   const body = req.body;
   if (!body.name || !body.number)
      res.status(400).json({ error: "Please provide name and number" });

   const person = new Person({
      name: body.name,
      number: body.number,
   });

   person.save().then((savedPerson) => res.json(savedPerson));
});

// Delete person by id route
app.delete("/api/persons/:id", (req, res, next) => {
   Person.findByIdAndRemove(req.params.id)
      .then((result) => res.status(204).end)
      .catch((error) => next(error));
});

// Update person by name
app.put("/api/persons/:id", (req, res, next) => {
   const body = req.body;

   const person = {
      name: body.name,
      number: body.number,
   };

   Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then((updatedPerson) => res.json(updatedPerson))
      .catch((error) => next(error));
});

// Phonebook info route
app.get("/info", (req, res, next) => {
   const requestReceivedAt = new Date();
   Person.find({})
      .then((persons) =>
         res.send(
            `<p>Phonebook has info for ${persons.length} people</p><p>${requestReceivedAt}</p>`
         )
      )
      .catch((error) => next(error));
});

// Error handler Middleware
app.use((error, request, response, next) => {
   console.error(error.message);

   if (error.name === "CastError") {
      return response.status(400).send({ error: "malformatted id" });
   }
   next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
   console.log(`Server running at http://localhost:${PORT}`)
);
