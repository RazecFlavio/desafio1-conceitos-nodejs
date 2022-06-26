const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if (!user) {
    return response.status(400).json({ error: "User not found! " });
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return response.status(400).json({ error: "User already exists." });
  }
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user);
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  });
  return response.status(201).json(user.todos);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  const { title, deadline } = request.body;
  let todo = user.todos.find(todo => todo.id === id);
  let updatedTodo = todo;
  updatedTodo.title = title;
  updatedTodo.deadline = new Date(deadline);
  users.splice(todo, 1, updatedTodo);
  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqu
  const { user } = request;
  const { id } = request.params;
  let todo = user.todos.find(todo => todo.id === id);
  let updatedTodo = todo;
  updatedTodo.done = true;
  user.todos.splice(todo, 1, updatedTodo);
  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  let todo = user.todos.find(todo => todo.id === id);
  user.todos.splice(todo, 1);
  return response.status(201).send();
});

module.exports = app;