const express = require("express");

const app = express();

let persons = [
   {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1,
   },
   {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2,
   },
   {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3,
   },
   {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4,
   },
];

// body-parser
app.use(express.json());

// General route
app.get("/", (req, res) => {
   res.send("Hello world");
});

// Persons route
app.get("/api/persons", (req, res) => {
   res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
   const requestedId = Number(req.params.id);
   const person = persons.find((p) => p.id === requestedId);
   if (person) {
      res.json(person);
   } else {
      res.status(404).end();
   }
});

app.post("/api/persons", (req, res) => {
   const { name, number } = req.body;

   const checkNameExists = persons.find((p) => p.name === name);

   if (!name || !number)
      res.status(400).json({ error: "Please provide name and number" });

   if (checkNameExists)
      return res
         .status(400)
         .json({ error: `Contact with name "${name}" already exists` });

   const newPerson = {
      name,
      number,
      id: Math.random() * 10000000,
   };

   persons = persons.concat(newPerson);

   res.json(newPerson);
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

const PORT = 3001;
app.listen(PORT, () =>
   console.log(`Server running at http://localhost:${PORT}`)
);
