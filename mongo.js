const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const nimiArgu = process.argv[3]
const numeroArgu = process.argv[4]


const url =
  `mongodb+srv://pekken:${password}@puhelinluettelofullstac.arqbog2.mongodb.net/personApp?retryWrites=true&w=majority`


  const personSchema = new mongoose.Schema({
    nimi: String,
    numero: String,
  })

mongoose.set('strictQuery', false)
mongoose.connect(url)
const Person = mongoose.model('Person', personSchema)


const person = new Person({
  nimi: nimiArgu,
  numero: numeroArgu 
})

person.save().then(result => {
  console.log('person saved!')
}).then(
Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
)