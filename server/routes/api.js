var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');


router.post('/register', function(req, res) {
  User.register(new User({ name: req.body.name, username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

//Test only #TBD
router.get('/isItWorking', function(req, res) {
    res.json({ message: 'Yes! Its Working' });
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.get('/users', function(req, res) {
  var user_name = req.query.username;
  User.findOne({username: user_name}, function (err, user) {
        if (err != null || !user){
            return res.status(401).json({
              status: false
            });
        }
        res.status(200).json(user);
  });
});

router.post('/edificio', function(req,res){
var edificio = new Edificio();
  edificio.nome = req.body.nome;
  edificio.descricao = req.body.descricao;
  edificio.atividade = req.body.atividade;
  edificio.save(function(error){
    if(error) res.send(error);
    res.json({message: 'Predio criado com sucesso!'});
  });

});
router.get('/edificios', function(req,res){
  Edificio.find(function(err, edificios){
    if (err) res.send(err);
    res.json(edificios);
  });
});
  
module.exports = router;