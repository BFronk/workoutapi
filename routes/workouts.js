const express = require('express');
const router = express.Router();
const ensureAuth = require('../middleware/auth');

const {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
} = require('../controllers/workoutController');

router.get('/:id', ensureAuth, getWorkoutById);
router.get('/', ensureAuth, getAllWorkouts);
router.post('/', ensureAuth, createWorkout);
router.put('/:id', ensureAuth, updateWorkout);
router.delete('/:id', ensureAuth, deleteWorkout);

module.exports = router;