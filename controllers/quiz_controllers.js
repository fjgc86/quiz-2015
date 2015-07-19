var models = require('../models/models.js');

// GET /quizes
exports.index = function(req, res){
  if(req.query.search){ // Si en la cabecera viene el parámetro search...
    // Modificar texto de entrada para buscar en la BBDD
    // Para que busque palabras separadas, el string que se entregue
    // a la BBDD tiene que tener el formato %palabra1%palabra2%
    var texto = '%'; // El string empieza por %
    // Se busca en el string de entrada la concatenación de letras y se
    // guardan en el array "palabras". Se tienen en cuenta la ñ y las
    // vocales con tilde.
    var palabras = req.query.search.match(/[\w,ñ,á,é,í,ó,ú]+/g);
    // Se unen las distintas palabras del array, añadiendo % al final de cada
    // una.
    for(var i=0; i < palabras.length; i++){
      texto += palabras[i]+'%';
    }
    // Se buscan las coicidencias en la base de datos
    models.Quiz.findAll({where:["pregunta like ?", texto]})
    .then(function(quizes){
      // Renderizar quizes/index enviando el objeto que contiene
      // el resultado de la busqueda
      res.render('quizes/index', {quizes: quizes});
    });
  }else{ // Si no viene el parametro search en la cabecera...
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index', {quizes: quizes});
    });
  }
};

// GET /quizes/:id
exports.show = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    res.render('quizes/show', {quiz: quiz});
  });
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    if(req.query.respuesta === quiz.respuesta){
      res.render('quizes/answer', {
        quiz: quiz,
        respuesta: 'Correcto'});
    }else{
      res.render('quizes/answer', {
        quiz: quiz,
        respuesta: 'Incorrecto'});
    }
  });
};
