const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const convertToWebp = require('../middleware/sharp')
const stuffControllers = require('../controllers/books')


router.post('/', auth, multer, convertToWebp, stuffControllers.createBook)
router.put('/:id', auth, multer, convertToWebp, stuffControllers.modifyBook)
router.post('/:id/rating', auth, stuffControllers.rateBook)
router.delete('/:id', auth, stuffControllers.deleteBook)
router.get('/bestrating', stuffControllers.getBestBooks)
router.get('/:id', stuffControllers.getOneBook)
router.get('/', stuffControllers.getAllBooks)

module.exports = router 