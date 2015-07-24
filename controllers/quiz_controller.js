var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  if (!req.query.search) { 
    models.Quiz.findAll().then(function(quizes){
      res.render( 'quizes/index.ejs', { quizes: quizes});
    }
    ).catch(function(error) {next(error);})
  } else {
    //Jugando con split y join se cambian los espacios en blanco por %
    //Comparando mayúsculas con mayúsculas soslayamos los problemas que 
    //pueda dar Postgress que tiene identificadores case sensitive
    models.Quiz.findAll({where: ["upper(pregunta) like ?", "%"+req.query.search.toUpperCase().split(" ").join("%")+"%"]
                        ,order:"upper(pregunta) ASC"})
    .then(
    function(quizes) {
        res.render( 'quizes/index.ejs', {quizes: quizes});
      }
    ).catch(function(error) {next(error);})
  };
}

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
exports.author = function(req, res){
	res.render('author',{autor:'Jaime Canillas Galiano'});
};
