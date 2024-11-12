let todos = require("../data/data");

const foundTodoByTitle = (title) => todos.find((todo) => todo.title === title);

const foundTodoById = (id) => todos.find((todo) => todo.id === +id);

const createTodoService = (title, content) => {
  const newTodo = { title, content };
  newTodo.id = todos.length + 1;
  todos.push(newTodo);
  return newTodo;
};

const updateTodoService = (id, todoBody) => {
  const foundTodo = foundTodoById(id);
  if (!foundTodo) {
    return null;
  } else {
    foundTodo.title = todoBody.title;
    foundTodo.content = todoBody.content;
    return foundTodo;
  }
};

const deleteTodoService = (id) => {
  const filteredTodos = todos.filter((todo) => +todo.id !== +id);
  todos = [...filteredTodos];
};

module.exports = {
  createTodoService,
  foundTodoByTitle,
  foundTodoById,
  updateTodoService,
  deleteTodoService,
};
