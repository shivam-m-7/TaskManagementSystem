const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    duedate: { type: Date },
    status: { type: String },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
  }); 

  const Task = mongoose.model('Tasks', TaskSchema);

  module.exports = {Task}