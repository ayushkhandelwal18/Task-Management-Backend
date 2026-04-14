const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt
});

module.exports = mongoose.model('Task', taskSchema);
