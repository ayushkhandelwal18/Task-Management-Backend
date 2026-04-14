const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.patch('/:id', taskController.updateTask);
router.patch('/:id/complete', taskController.markTaskCompleted);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
