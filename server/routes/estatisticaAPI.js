var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');


// Estatisticas referentes a edificios
router.get('/estatistica/edificio/:edificio_id', function(req,res){
  Edificio.findById(req.params.edificio_id, function(error, edificio){
    if(error) res.send(edificio);
    sum = 0.0;
    max = -1.0;
    min =  9999999;
    res.json(calculaEstatisticas(edificio.consumoDiario));
  });
});

var calculaEstatisticas = function(consumos){
  var sum = 0.0;
  var max = -1;
  var min = 9999999999;
  var acum = 0;
  var maxDia;
  var minDia;
  consumos.forEach(function(cd){
    var consumo = cd.consumo;
    acum += consumo;
    sum += consumo;
    if (consumo> max){
      max = consumo;
      maxDia = cd.dia;
    };
    if (min > consumo){
      min = consumo;
      minDia = cd.dia;
    };
  });
  total = consumos.length;
  return {total: acum, media: sum/total, total: sum, maximo:max, dia_max:maxDia, minimo: min, dia_minimo: minDia};
};

var filtrarPorAno = function(consumos, ano){
  var consumosFiltrados = [];
  consumos.forEach(function(cd){
    if (cd.dia.getFullYear() == ano ){
        consumosFiltrados.push(cd);
    };
  });
  return consumosFiltrados;

};


router.get('/estatistica/edificio/:edificio_id/ano/:ano', function(req,res){
  Edificio.findById(req.params.edificio_id,  function(error, edificio){
    if(error) res.send(edificio);
    var consumos = filtrarPorAno(edificio.consumoDiario, req.params.ano);
    res.json(calculaEstatisticas(consumos));
    
    }
    );

});

router.get('/estatistica/edificio/:edificio_id/mes/:mes', function(req,res){
  Edificio.findById(req.params.edificio_id,  function(error, edificio){
    if(error) res.send(edificio);
    var consumos = edificio.consumoDiario.filter(function(elem, i, array){
      return elem.dia.getMonth() == req.params.mes;
    }) ;
    res.json(calculaEstatisticas(consumos));
    }
    );

});

router.get('/estatistica/setor/:setor', function(req,res){
  Edificio.findBySetor(req.params.setor,  function(error, edificios){
    if(error) res.send(edificios);

var consumos = [];
    for (i in edificios){
      consumos = consumos.concat(edificios[i].consumoDiario);
    }
    console.log(consumos);

        res.json(calculaEstatisticas(consumos));
    }
    );

});

router.get('/estatistica/setor/:setor/ano/:ano', function(req,res){
  Edificio.findBySetor(req.params.setor,  function(error, edificios){
    if(error) res.send(edificios);

var consumos = [];
    for (i in edificios){
      consumos = consumos.concat(edificios[i].consumoDiario);
    }
    consumos = filtrarPorAno(consumos ,req.params.ano);
      res.json(calculaEstatisticas(consumos));
    }
    );

});








module.exports = router;