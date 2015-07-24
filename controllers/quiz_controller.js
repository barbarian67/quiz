var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
exports.index = function(req, res) {
  if (!req.query.search) { 
    models.Quiz.findAll().then(function(quizes){
      res.render( 'quizes/index.ejs', { quizes: quizes,errors: []});
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
        res.render( 'quizes/index.ejs', {quizes: quizes, errors: []});
      }
    ).catch(function(error){next(error)});
  };
}

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render(
    'quizes/answer', 
    { quiz: req.quiz, 
      respuesta: resultado, 
      errors: []
    }
  );
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz 
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};
exports.author = function(req, res){
  res.render('author',{autor:'Jaime Canillas Galiano',errors: []});
};
// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  var errors = quiz.validate();//ya qe el objeto errors no tiene then(
  if (errors)
    {
      var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
      for (var prop in errors) errores[i++]={message: errors[prop]};
      res.render('quizes/new', {quiz: quiz, errors: errores});
    } else {
      quiz // save: guarda en DB campos pregunta y respuesta de quiz
      .save({fields: ["pregunta", "respuesta"]})
      .then( function(){ res.redirect('/quizes')}) ;
    }
  };