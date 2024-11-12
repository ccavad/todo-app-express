const todos = require("../data/data");
const {
  createTodoService,
  foundTodoByTitle,
  foundTodoById,
  updateTodoService,
  deleteTodoService,
} = require("../services/todos.services");
const { resultTypes } = require("../utils/constants");

const getTodos = (req, res) => {
  res.send(todos);
};

const createTodo = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(401).send({
      message: "no todo body found",
      resultType: resultTypes.emptyBody,
    });
  }

  const foundTodo = foundTodoByTitle(title);
  if (foundTodo) {
    return res.status(401).send({
      message: "same title todo already created",
      resultType: resultTypes.dublicateTitle,
    });
  }

  const newTodo = createTodoService(title, content);
  res.send({
    message: "todo succesfully created",
    data: newTodo,
    resultType: resultTypes.success,
  });
};

const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(401).send({
      message: "no todo body found",
      resultType: resultTypes.emptyBody,
    });
  }

  const todoBody = { title, content };
  const updatedTodo = updateTodoService(id, todoBody);
  if (!updatedTodo) {
    return res.status(404).send({
      message: `no todo with ${id} id found`,
      resultType: resultTypes.notFoundId,
    });
  } else {
    return res.json({
      message: `todo with ${id} succesfully updated`,
      todo: updatedTodo,
      resultType: resultTypes.success,
    });
  }
};

const deleteTodo = (req, res) => {
  const { id } = req.params;

  if (id) {
    deleteTodoService(id);
    return res.json({
      message: "todo succesfully deleted",
      resultType: resultTypes.success,
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
