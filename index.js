const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

const Person = require('./models/person')

const url = process.env.MONGODB_URI

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.nimi)
    
  const person = new Person({
    nimi: body.nimi,
    numero: body.numero || false,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
    console.log('Lisättiin heppu kantaan', savedPerson)
  })
})



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.get('/api/persons', (req, res) => {  
  Person.find({}).then(persons => {
    res.json(persons)
    }
  )
})

app.get('/info', (req, res) => {
    const date = new Date();        
    Person.estimatedDocumentCount().then(count =>{
    console.log(count);
    res.send("<div>Phonebook has info for " + count + " people</div><div>" + date.toString() +  "</div>")   
    })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      nimi: body.nimi,
      numero: body.numero,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })