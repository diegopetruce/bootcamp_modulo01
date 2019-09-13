////Iniciar o express
const express = require("express");

////Setar a varíavel com a função do express
const server = express();

/// Utilizar o Json no express
server.use(express.json());

/// Constante de usuários
const users = ["Diego", "Robson", "Wilson"];

/// Conceito de Middleware Global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

//Conceito de Middleware Local com função
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  req.user = user;

  return next();
}

///// Rota de listagem de usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

//// Rotas de Listagem de um usuário, aplicando o middleware pra ver se existe
server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(req.user);
});

//// Rota de Criação de usuário com middleware verificando se não está vazio
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

//// Rota de Alteração de usuário com duas verificações
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;

  return res.json(users);
});

/// Rota de delete de usuário com verificação de index
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

/// Porta onde o servidor vai responder
server.listen(3000);
