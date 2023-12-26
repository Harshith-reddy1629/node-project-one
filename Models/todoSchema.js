const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    task: {
      type: String,
      required: [true, "task is mandatory"],
    },
    selected: {
      type: Boolean,
      required: [true, "---"],
    },
    status: {
      type: String,
      required: [true, "progress of task"],
    },
    note: {
      type: String,
      required: [true, "note"],
    },
  },
  {
    timestamps: true,
  }
);

const todoData = mongoose.model("todos", todoSchema);

module.exports = todoData;
