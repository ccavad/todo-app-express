const express = require("express");
const cors = require("cors");

const todoRouter = require("../routes/todos.router");
const app = express();

const PORT = 3001;

app.use(express.json());
app.use(cors());

app.use("/todos", todoRouter);

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
