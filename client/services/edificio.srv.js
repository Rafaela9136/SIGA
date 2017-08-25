angular.module('myApp')
  .service('edificioService', function() {
    
    var edificioId = {};
    var isCaixa = false;
    var UFCG_ID = 0;
  	var isNew = false;
  	var edificio = {};
    var granularidade = 'day';
    var alerta = {};

    this.getAlerta = function(){
      return alerta;
    };
    this.setAlerta = function(a){
      alerta = a;
    }

    this.setGranularidade = function(granularidade){
      granularidade = granularidade;

    };

    this.getGranularidade = function(){
      return granularidade;
    };

    this.getEdificio = function(){
      return edificio;
    };
    this.setEdificio = function(ed){
      edificio = ed;
    }

    this.getEdificioId = function(){
      return edificioId;
    };

    this.setEdificioId = function(id){
      edificioId = id;
    };

    this.setCaixa = function(b){
    	isCaixa = b;
    };

    this.isCaixa = function(){
    	return isCaixa;
    };

    this.setIsUFCG = function(flag) {
     isUFCG = flag; 
    };

    this.isUFCG = function() {
      return edificioId == UFCG_ID;
    };

    
    this.isNew = function(){
    	return isNew;
    };
    this.setNew = function(bool){
    	isNew = bool;
    };

});