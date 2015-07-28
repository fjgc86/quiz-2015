var express = require('express');
var router = express.Router();
var quizControllers = require('../controllers/quiz_controllers');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// GET /author
router.get('/author', function(req, res){
  res.render('author');
});

// Autoload de comandos con :quizId
router.param('quizId',quizControllers.load); // Autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes', quizControllers.index);
router.get('/quizes/:quizId(\\d+)', quizControllers.show);
router.get('/quizes/:quizId(\\d+)/answer', quizControllers.answer);
router.get('/quizes/new', quizControllers.new);
router.post('/quizes/create',quizControllers.create);

module.exports = router;
