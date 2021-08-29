const express = require('express');
const router = express.Router();

// JSONパース
router.use(express.json());

// router内での処理 
router.get('/books', require('./books/get'));
router.post('/books', require('./books/create'));
router.put('/books', require('./books/update'));
router.delete('/books', require('./books/delete'));

module.exports = router;