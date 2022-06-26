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
    return response.status(404).json({ error: "User not found! " });
  }
  request.user = user;
  return next();
}
function todoExists(request, response, next) {
  const user = request.user
  const { id } = request.params;
  let todo = user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "TODO not found! " });
  }
  request.todo = todo;
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
  let todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };
  user.todos.push(todo);
  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, todoExists, (request, response) => {  
  const { title, deadline } = request.body;

  let todo = request.todo;
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, todoExists, (request, response) => {  
  let todo = request.todo;
  todo.done = true;
  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, todoExists, (request, response) => {
  // Complete aqui  
  const { user } = request;
  let todo = request.todo;
  user.todos.splice(todo, 1);
  return response.status(204).send();
});

module.exports = app;