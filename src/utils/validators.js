const validateTaskInput = (title, description) => {
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Task title is required and cannot be empty');
  }

  if (description && typeof description !== 'string') {
    errors.push('Task description must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateTaskInput };
