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

// Definición de rutas de /quizes

// Toda la lista de preguntas
router.get('/quizes', quizControllers.index);
// Una pregunta
router.get('/quizes/:quizId(\\d+)', quizControllers.show);
// La respuesta de una pregunta
router.get('/quizes/:quizId(\\d+)/answer', quizControllers.answer);

module.exports = router;
