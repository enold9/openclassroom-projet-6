const express = require('express')
const app = express()
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/books')
const path = require('path');
const userRoutes = require('./routes/user')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use('/api/books', stuffRoutes)
app.use('/api/auth', userRoutes )
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app  