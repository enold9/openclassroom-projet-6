const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const stuffControllers = require('../controllers/books')


router.post('/', auth, multer, stuffControllers.createBook)
router.put('/:id', auth, multer, stuffControllers.modifyBook)
router.delete('/:id', auth, stuffControllers.deleteBook)
router.get('/:id', stuffControllers.getOneBook)
router.get('/', stuffControllers.getAllBooks)

module.exports = router 