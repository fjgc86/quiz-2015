var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(function(quiz){
    if(quiz){
      req.quiz=quiz;
      next();
    }else{
      next(new Error('No existe quizId=' + quizId));
    }
  });
}

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
    var palabras = req.query.search.match(/[\w,ñ,á,é,í,ó,ú]+/ig);
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
      res.render('quizes/index', {quizes: quizes, errors:[]});
    });
  }else{ // Si no viene el parametro search en la cabecera...
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index', {quizes: quizes, errors:[]});
    });
  }
};

// GET /quizes/:id
exports.show = function(req, res){
  res.render('quizes/show', {quiz: req.quiz, errors:[]});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){resultado = 'Correcto';}
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[]});
};

// GET /quizes/new
exports.new = function(req,res){
  var quiz = models.Quiz.build({
    // Valores que se visualizarárn en los cajetines del formulario
    pregunta: "Pregunta",
    respuesta: "Respuesta",
    tema: "Otro"
  });
  res.render('quizes/new', {quiz: quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req,res){
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate()
  .then(
    function(err){
      if(err){
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      }else{
        // Guarda en la DB los campos pregunta y respuesta de quiz
        quiz
          .save({fields:["pregunta","respuesta", "tema"]})
          .then(function(){
            // Redirección HTTP (URL relativo) lista de preguntas
            res.redirect('/quizes');
        });
      }
    }
  )
}

// GET /quizes/:id/edit
exports.edit = function(req, res, next){
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz, errors: []});
}

// PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }else{
        req.quiz  // save: guarda campos pregunta y respuesta en DB
        .save({fields: ["pregunta","respuesta", "tema"]})
        // Redirección HTTP a lista de preguntas (URL relativo)
        .then(function(){res.redirect('/quizes');});
      }
    }
  )
}

// DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){
    next(error)
  });
}
