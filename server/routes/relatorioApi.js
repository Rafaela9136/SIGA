var express = require('express');
var router = express.Router();
var passport = require('passport');
var json2csv = require('json2csv');
var fs = require('fs');
var moment = require('moment');
var Edificio = require('../models/edificio.js');
var EstatisticaAPI = require('./estatisticaApi.js');
EstatisticaAPI = EstatisticaAPI.data;

// EXMEMPLO localhost:3000/relatorio/edificio/:edifico_id/csv?cardinalidade=sem&data=2017-08-19
router.get('/relatorio/edificio/:edificio_id/csv/consumos', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
    if (err) {
        res.status(400).json({error: err});
    }

    consumos    = edificio.historicoConsumo;

    cardinalidade = req.query.cardinalidade;
    if (cardinalidade) {
        if (cardinalidade == 'sem') {
            if (req.query.data) {
                mdataFinal = moment(req.query.data);
                mdataFinal.add(1, 'days');
                dataFinal = new Date(mdataFinal);
                mdataInicial = moment(dataFinal).subtract(7, 'days');
                dataInicial = new Date(mdataInicial);

                consumos    = EstatisticaAPI.filtrarRange(consumos, dataInicial, dataFinal);
            } else {
                res.status(400).send('Data não informada.');
            }
        } else if (cardinalidade == 'mes') {
            if (req.query.mes) {
                consumos    = EstatisticaAPI.filtrarPorMes(consumos, req.query.mes);
            } else {
                res.status(400).send('Mês não informado.');
            }
        } else if (cardinalidade == 'ano') {
            if (req.query.ano) {
                consumos    = EstatisticaAPI.filtrarPorAno(consumos, req.query.ano);
            } else {
                res.status(400).send('Ano não informado.');
            }
        }
    };

    var fields = [
    {
        label: 'Consumo',
        value: 'consumo'
    },
    {
        label: 'Data',
        value: 'data'
    }];

    var opts = {
      data: consumos,
      fields: fields,
      unwindPath: ['consumo'],
      quotes: ''
    };

    var csv = json2csv(opts);
    var filePath = 'Consumos ' + edificio.nome + '.csv';
 
    fs.writeFile(filePath, csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    res.json(edificio);
    });
});

router.get('/relatorio/edificio/:edificio_id/csv/vazamentos', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
    if (err) {
        res.status(400).json({error: err});
    }

    vazamentos  = edificio.vazamentos;

    cardinalidade = req.query.cardinalidade;
    if (cardinalidade) {
        if (cardinalidade == 'sem') {
            if (req.query.data) {
                mdataFinal = moment(req.query.data);
                mdataFinal.add(1, 'days');
                dataFinal = new Date(mdataFinal);
                mdataInicial = moment(dataFinal).subtract(7, 'days');
                dataInicial = new Date(mdataInicial);

                vazamentos  = EstatisticaAPI.filtrarRange(vazamentos, dataInicial, dataFinal);
            } else {
                res.status(400).send('Data não informada.');
            }
        } else if (cardinalidade == 'mes') {
            if (req.query.mes) {
                vazamentos  = EstatisticaAPI.filtrarPorMes(vazamentos, req.query.mes);
            } else {
                res.status(400).send('Mês não informado.');
            }
        } else if (cardinalidade == 'ano') {
            if (req.query.ano) {
                vazamentos  = EstatisticaAPI.filtrarPorMes(vazamentos, req.query.ano);
            } else {
                res.status(400).send('Ano não informado.');
            }
        }
    };

    var fields = [
    {
        label: 'Volume',
        value: 'volume'
    },
    {
        label: 'Data',
        value: 'data'
    }];

    var opts = {
      data: vazamentos,
      fields: fields,
      unwindPath: ['volume'],
      quotes: ''
    };

    var csv = json2csv(opts);
    var filePath = 'Vazamentos ' + edificio.nome + '.csv';
 
    fs.writeFile(filePath, csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    res.json(edificio);
    });
});

router.get('/relatorio/edificio/:edificio_id/csv/alertas', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(err, edificio) {
    if (err) {
        res.status(400).json({error: err});
    }

    alertas  = edificio.alertas;

    cardinalidade = req.query.cardinalidade;
    if (cardinalidade) {
        if (cardinalidade == 'sem') {
            if (req.query.data) {
                mdataFinal = moment(req.query.data);
                mdataFinal.add(1, 'days');
                dataFinal = new Date(mdataFinal);
                mdataInicial = moment(dataFinal).subtract(7, 'days');
                dataInicial = new Date(mdataInicial);

                alertas     = EstatisticaAPI.filtrarRange(alertas, dataInicial, dataFinal);
            } else {
                res.status(400).send('Data não informada.');
            }
        } else if (cardinalidade == 'mes') {
            if (req.query.mes) {
                alertas     = EstatisticaAPI.filtrarPorMes(alertas, req.query.mes);
            } else {
                res.status(400).send('Mês não informado.');
            }
        } else if (cardinalidade == 'ano') {
            if (req.query.ano) {
                alertas     = EstatisticaAPI.filtrarPorMes(alertas, req.query.ano);
            } else {
                res.status(400).send('Ano não informado.');
            }
        }
    };

    var fields = [
    {
        label: 'Data',
        value: 'data'
    }];

    var opts = {
      data: alertas,
      fields: fields,
      unwindPath: ['data'],
      quotes: ''
    };

    var csv = json2csv(opts);
    var filePath = 'Alertas ' + edificio.nome + '.csv';
 
    fs.writeFile(filePath, csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    res.json(edificio);
    });
});  

router.get('/relatorio/edificio/:edificio_id/pdf', function(req, res) {
    Edificio.findById(req.params.edificio_id, function(error, edificio) {
    if (error) {
        res.status(400).json({error: error});
    }

    consumos    = edificio.historicoConsumo;
    vazamentos  = edificio.vazamentos;
    alertas     = edificio.alertas;

    cardinalidade = req.query.cardinalidade;
    if (cardinalidade) {
        if (cardinalidade == 'sem') {
            if (req.query.data) {
                mdataFinal = moment(req.query.data);
                mdataFinal.add(1, 'days');
                dataFinal = new Date(mdataFinal);
                mdataInicial = moment(dataFinal).subtract(7, 'days');
                dataInicial = new Date(mdataInicial);

                consumos    = EstatisticaAPI.filtrarRange(consumos, dataInicial, dataFinal);
                vazamentos  = EstatisticaAPI.filtrarRange(vazamentos, dataInicial, dataFinal);
                alertas     = EstatisticaAPI.filtrarRange(alertas, dataInicial, dataFinal);
            } else {
                res.status(400).send('Data não informada.');
            }
        } else if (cardinalidade == 'mes') {
            if (req.query.mes) {
                consumos    = EstatisticaAPI.filtrarPorMes(consumos, req.query.mes);
                vazamentos  = EstatisticaAPI.filtrarPorMes(vazamentos, req.query.mes);
                alertas     = EstatisticaAPI.filtrarPorMes(alertas, req.query.mes);
            } else {
                res.status(400).send('Mês não informado.');
            }
        } else if (cardinalidade == 'ano') {
            if (req.query.ano) {
                consumos    = EstatisticaAPI.filtrarPorAno(consumos, req.query.ano);
                vazamentos  = EstatisticaAPI.filtrarPorAno(vazamentos, req.query.ano);
                alertas     = EstatisticaAPI.filtrarPorAno(alertas, req.query.ano);
            } else {
                res.status(400).send('Ano não informado.');
            }
        }
    };

    var consumosF = [];
    for (var i = 0; i < consumos.length; i++) {
        consumosF[i, 0] = consumos[i].data.getDate() + '/' + consumos[i].data.getMonth() + '/' + consumos[i].data.getFullYear();
        consumosF[i, 1] = consumos[i].consumo.toString();
    };

    var vazamentosF = [];
    for (var i = 0; i < vazamentos.length; i++) {
        vazamentosF[i, 0] = vazamentos[i].data.getDate() + '/' + vazamentos[i].data.getMonth() + '/' + vazamentos[i].data.getFullYear();
        vazamentosF[i, 1] = vazamentos[i].volume.toString();
    };

    var alertasF = [];
    for (var i = 0; i < alertas.length; i++) {
        alertasF[i, 0] = alertas[i].data.getDate() + '/' + alertas[i].data.getMonth() + '/' + alertas[i].data.getFullYear();
    };

    var estatisticas = EstatisticaAPI.calculaEstatisticas(consumos);

    var style= {
            title: {
                fontSize: 16,
                bold: true
            },
            body: {
                fontSize: 14
            }
        };

    var docDefinition = {
        content: [
            {text: 'Edificação: ' + edificio.nome + '\n', fontSize: 20 },
            {text: [
                { text: 'Descrição Sucinta: ', style: style['title'] }, { text: edificio.descricao + '\n', fontSize: 16},
                { text: 'Atividade Preponderante: ', style: style['title'] }, { text: edificio.atividade + '\n', fontSize:16},
                { text: 'Características Físicas:' + '\n', style: style['title'] },
                { text: 'Localização = Setor ' + edificio.caracteristicasFisicas.localizacao.setor + ', Bloco ' + edificio.caracteristicasFisicas.localizacao.bloco + '\n', style: style['body'] },
                { text: 'Área = ' + edificio.caracteristicasFisicas.area + 'm²' + '\n', style: style['body'] },
                { text: 'Nº de Pavimentos = ' + edificio.caracteristicasFisicas.n_pavimentos + '\n', style: style['body'] },
                { text: 'Ocupação Média = ' + edificio.caracteristicasFisicas.ocupacaoMedia + '\n', style: style['body'] },
                { text: 'Nº Bacias Sanitárias = ' + edificio.caracteristicasFisicas.n_baciasSanitarias + '\n', style: style['body'] },
                { text: 'Nº Torneiras = ' + edificio.caracteristicasFisicas.n_torneiras + '\n', style: style['body'] },
                { text: 'Nº Duchas = ' + edificio.caracteristicasFisicas.n_duchas + '\n', style: style['body'] },
                { text: 'Nº Chuveiros = ' + edificio.caracteristicasFisicas.n_chuveiros + '\n', style: style['body'] },
                { text: 'Nº Pias = ' + edificio.caracteristicasFisicas.n_pias + '\n', style: style['body'] },
                { text: 'Volume do Reservatório = ' + edificio.caracteristicasFisicas.volumeReservatorio + 'm³' + '\n' + '\n', style: style['body'] },
                { text: 'Consumo de Água' + '\n', style: style['title'] }] 
            },
            {table: {
                headerRows: 1,

                body: [
                    ['DATA', 'CONSUMO (m³)'],
                    consumosF
                    ]
                }
            },
            { text: '\n' + 'Vazamentos:' + '\n', style: style['title'] },
            {table: {
                headerRows: 1,

                body: [
                    [ 'DATA', 'VOLUME (m³)'],
                    vazamentosF
                    ]
                }
            },
            { text: '\n' + 'Alertas:' + '\n', style: style['title'] },
            {table: {
                headerRows: 1,

                body: [
                    [ 'DATA'],
                    alertasF
                    ]
                }
            },
            { text: '\n' + 'Consumo total: ' + estatisticas.total + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo médio: ' + estatisticas.media + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo médio esperado: ' + edificio.mediaEsperada + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo máximo: ' + estatisticas.maximo + 'm³' + '\n', style: style['title'] },
            { text: 'Consumo mínimo: ' + estatisticas.minimo + 'm³' + '\n', style: style['title'] }
        ],
        
    };
    res.send(docDefinition);
    });
});

module.exports = router;