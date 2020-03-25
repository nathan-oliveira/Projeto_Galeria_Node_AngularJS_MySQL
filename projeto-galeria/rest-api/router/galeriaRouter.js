var express = require('express');
var router = express.Router();
var GaleriaModel = require('../model/galeria/GaleriaModel');
var RespostaClass = require('../model/RespostaClass');

var fs = require('fs');
var pastaPublic = './public/imagens/';

router.get('/', function(req, resp, next) {
  let resposta = new RespostaClass();
  GaleriaModel.getTodos(function(erro, retorno) {
    if(erro) {
      resposta.erro = true;
      resposta.msg = 'Ocorreu um erro.';
    } else {
      resposta.dados = retorno;
    }

    resp.json(resposta);
  });
})

router.get('/:id?', function(req, resp, next) {
  let resposta = new RespostaClass();
  GaleriaModel.getId(req.params.id, function(erro, retorno) {
    if(erro) {
      resposta.erro = true;
      resposta.msg = 'Ocorreu um erro.';
    } else {
      resposta.dados = retorno;
    }

    resp.json(resposta);
  });
})

router.post('/?', function(req, resp, next) {
  let resposta = new RespostaClass();

  if(req.body.dados_imagem != null) {
    // let bitmap = new Buffer(req.body.dados_imagem.imagem_base64, 'base64')
    // Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from()
    let bitmap = new Buffer.from(req.body.dados_imagem.imagem_base64, 'base64')

    let dataAtual = new Date().toLocaleString().replace(/\//g, '').replace(/:/g, '').replace(/-/g, '').replace(/ /g, '');

    let nomeImagemCaminho = pastaPublic + dataAtual + req.body.dados_imagem.nome_arquivo
    fs.writeFileSync(nomeImagemCaminho, bitmap);
    req.body.caminho = nomeImagemCaminho;

    GaleriaModel.adicionar(req.body, function(erro, retorno) {
      if(erro) {
        resposta.erro = true;
        resposta.msg = 'Ocorreu um erro.';
      } else {
        if(retorno.affectedRows > 0) {
          resposta.msg = 'Cadastro realizado com sucesso.';
        } else {
          resposta.erro = true;
          resposta.msg = 'Não foi possivel adicionar o cadastro.';
        }
        // resposta.dados = retorno;
        console.log('resp', resposta)
      }
      resp.json(resposta);
    });
  } else {
    resposta.erro = true;
    resposta.msg = 'Favor enviar uma imagem.';
    console.log('erro: ', resposta.msg)
    resp.json(resposta);
  }
})

router.put('/', function(req, resp, next) {
  let resposta = new RespostaClass();

  if(req.body.dados_imagem != null) {
    let bitmap = new Buffer.from(req.body.dados_imagem.imagem_base64, 'base64')

    let dataAtual = new Date().toLocaleString().replace(/\//g, '').replace(/:/g, '').replace(/-/g, '').replace(/ /g, '');

    let nomeImagemCaminho = pastaPublic + dataAtual + req.body.dados_imagem.nome_arquivo

    fs.writeFileSync(nomeImagemCaminho, bitmap);
    req.body.caminho = nomeImagemCaminho;
  }
  GaleriaModel.editar(req.body, function(erro, retorno) {
    if(erro) {
      resposta.erro = true;
      resposta.msg = 'Ocorreu um erro.';
    } else {
      if(retorno.affectedRows > 0) {
        resposta.msg = 'Cadastro alterado com sucesso.';
      } else {
        resposta.erro = true;
        resposta.msg = 'Não foi possivel alterar o cadastro.';
      }
      // resposta.dados = retorno;
      console.log('resp', resposta)
    }
    resp.json(resposta);
  });
})

router.delete('/:id?', function(req, resp, next) {
  let resposta = new RespostaClass();
  GaleriaModel.deletar(req.params.id, function(erro, retorno) {
    if(erro) {
      resposta.erro = true;
      resposta.msg = 'Ocorreu um erro.';
    } else {
      if(retorno.affectedRows > 0) {
        resposta.msg = 'Cadastro excluido com sucesso.';
      } else {
        resposta.erro = true;
        resposta.msg = 'Não foi possivel excluir o cadastro.';
      }

      resposta.dados = retorno;
    }
    resp.json(resposta);
  });
})

module.exports = router;