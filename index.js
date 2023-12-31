const express = require("express");
const app = express();
const morgan = require('morgan')
app.use(express.json()) //LOOK INTO THIS A LITTLE MORE...


var persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


morgan.token('object', function (req, res) { 
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

app.get("/", (request, response) => {
  response.send(`<h1>THIS IS A PHONEBOOK TEST</h2> </br>
                <p>Phonebook has info for ${persons.length} people.</p>
                <p>${new Date}</p>`)
})

app.get("/api/persons", (request, response)=> {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
    response.json(person)
  } else {
    response.send("<h1>DOES NOT EXIST</h1>")
    response.status(404).end();
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
})

const generateId = () => {
  const maxNum = Math.max(...persons.map(person => person.id));
  return maxNum + 1;
}


app.post("/api/persons", (request, response) => {
  const body = request.body;
  
  if (!body.name || !body.number) {
    return response
      .status(400)
      .json(
        {
          error: "content missing..."
        }
      )
  }

  persons.find(person => {
    if (person.name === body.name) {
      return response
        .status(400)
        .json({
          error: "No duplicate names allowed..."
        })
    }
  })

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  
  persons.concat(person)
  response.json(person)
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

