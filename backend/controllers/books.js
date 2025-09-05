const Thing = require('../models/Books')
const fs = require('fs')

exports.createThing = (req, res, next)=>{
  console.log('creating a thing...')
  const thingObject = JSON.parse(req.body.book)
  delete thingObject._id
  delete thingObject._userId
  const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  thing.save()
    .then(()=>res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error=>{res.status(400).json({ error })})
}

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }
  delete thingObject._userId
  Thing.findOne({_id: req.params.id})
    then((book)=>{
      if(book.userId != req.auth.userId){
        res.status(401).JSON({message: 'Not authorized'})
      }
      else{
        Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }))
}

exports.deleteThing = (req, res, next) => {
   Thing.findOne({ _id: req.params.id})
    .then(book =>{
      if(book.userId != req.auth.userId){
        res.status(401).JSON({message: 'Not authorized'})
      }else{
        const filename = book.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, ()=>{
      console.log('osidjf')
          Thing.deleteOne({_id: req.params.id})
            .then(book => res.status(200).json({message: 'Objet supprimé !'}))
            .catch(error => res.status(401).JSON({message: 'Not authorized'}))
        })
      }
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getOneBook = (req, res, next)=>{
  Thing.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }))
}

exports.getAllBooks = (req, res, next) => {
  Thing.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}

//les thing c'est des book