const Joi = require('joi');

const workoutSchema = Joi.object({
  name: Joi.string().required(),
  muscleGroup: Joi.string().required(),
  sets: Joi.number().required(),
  reps: Joi.number().required(),
  weight: Joi.number().required(),
  date: Joi.date().required(),
  notes: Joi.string().optional()
});

module.exports = workoutSchema;