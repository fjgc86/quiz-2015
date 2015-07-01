var express = require('express');
var router = express.Router();
var quiz_controllers = require('../controllers/quiz_controllers');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// GET /author
router.get('/author', function(req, res){
  res.render('author');
});

router.get('/quizes/question', quiz_controllers.question);
router.get('/quizes/answer', quiz_controllers.answer);

module.exports = router;
