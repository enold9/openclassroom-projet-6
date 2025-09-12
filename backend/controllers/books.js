const Book = require('../models/Books')
const Rating = require('../models/Ratings')
const fs = require('fs')

exports.createBook = (req, res, next)=>{
  const bookObject = JSON.parse(req.body.book)
  delete bookObject._id
  delete bookObject._userId
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  book.save()
    .then(()=>res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error=>{res.status(400).json({ error })})
}

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }
  delete bookObject._userId
  Book.findOne({_id: req.params.id})
    .then((book)=>{
      if(book.userId != req.auth.userId){
        res.status(401).JSON({message: 'Not authorized'})
      }
      else{
        Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }))
}

exports.rateBook = async (req, res, next) => {
  const userId = req.body.userId;
  const grade = req.body.rating;
  try {
    await Book.updateOne(
      { _id: req.params.id },
      { $pull: { ratings: { userId } } }
    );
    await Book.updateOne(
      { _id: req.params.id },
      { $push: { ratings: { userId, grade } } }
    );
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error });
    }
    const ratings = book.ratings;
    const averageRating = ratings.length
      ? ratings.reduce((acc, curr) => acc + curr.grade, 0) / ratings.length
      : 0;
    book.averageRating = averageRating;
    await book.save();

    const bookId = book.toObject();
    bookId.id = bookId._id;
    res.status(200).json(bookId);
  } catch (error) {
    res.status(400).json({ error });
  }
  // await Book.findOne({ _id: req.params.id})
  //      .then(book => {
  //       const ratings = book.ratings;
  //       const averageRating = ratings.length
  //         ? ratings.reduce((acc, curr) => acc + curr.grade, 0) / ratings.length
  //         : 0;
  //       book.averageRating = averageRating;                                            pourquoi ça veut pas :(
  //       book.save()
  //         .then(() => res.status(200).json({ message: 'Note ajoutée !' }))
  //         .catch(error => res.status(400).json({ error }))
  //     })
  //      .catch(res.status(404).json({ error }))
}

exports.deleteBook = (req, res, next) => {
   Book.findOne({ _id: req.params.id})
    .then(book =>{
      if(book.userId != req.auth.userId){
        res.status(401).JSON({message: 'Not authorized'})
      }else{
        const filename = (book.imageUrl).split('/images/')[1]
        fs.unlink(`images/${filename}`, ()=>{
          Book.deleteOne({_id: req.params.id})
            .then(book => res.status(200).json({message: 'Objet supprimé !'}))
            .catch(error => res.status(401).json({message: 'Not authorized'}))
        })
      }
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getOneBook = (req, res, next)=>{
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }))
}

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}

exports.getBestBooks = (req, res, next) => {
  Book.find().sort({averageRating: -1}).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}
