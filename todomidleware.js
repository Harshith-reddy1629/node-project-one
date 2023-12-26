const todoData = require("./Models/todoSchema");

const getTodos = async (req, res) => {
  const C = req.user;
  const getAll = await todoData.find();
  res.status(200).send(getAll);
};

const getTodoTasks = async (req, res) => {
  const { username, id, name, email } = req.user;

  const getT = await todoData.find({ userId: id });

  res.send(getT).status(200);
};

exports.getTodoTasks = getTodoTasks;

const createTask = async (req, res) => {
  const { task, status = "todo", selected = false, note = "" } = req.body;
  const { id } = req.user;

  try {
    if (!task) {
      res.status(400).send({ errMsg: "Enter your todo task" });
    } else {
      const taskCreated = await todoData.create({
        userId: id,
        task,
        status,
        selected,
        note: "NOTE",
      });

      res.status(201).send(taskCreated);
    }
  } catch (error) {
    res.status(400).send({ errMsg: error });
  }
};

const updateTask = async (req, res) => {
  const { task, status = "todo", selected = false, note = "" } = req.body;

  const { id } = req.params;

  try {
    if (!task) {
      res.status(400).send({ errMsg: "Enter your todo task" });
    } else {
      const taskUpdated = await todoData.updateOne(
        { _id: id },
        { task, status, selected, note }
      );
      res.status(201).send(taskUpdated);
    }
  } catch (error) {
    res.status(400).send({ errMsg: error });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletingTask = await todoData.findByIdAndDelete(id);
    if (!deletingTask) {
      res.status(404).send({
        errMsg: "Already deleted",
      });
    } else {
      res.status(200).send({ msg: "DELETED", ...deletingTask });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTodos = getTodos;
exports.createTask = createTask;
exports.deleteTask = deleteTask;
exports.updateTask = updateTask;
