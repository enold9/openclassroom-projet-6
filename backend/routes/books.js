const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const stuffControllers = require('../controllers/books')

router.post('/', auth, multer, stuffControllers.createThing) 
router.put('/:id', auth, multer, stuffControllers.modifyThing)
router.delete('/:id', auth, stuffControllers.deleteThing)
router.get('/:id', stuffControllers.getOneThing)
router.get('/', stuffControllers.getAllThings)

module.exports = router 