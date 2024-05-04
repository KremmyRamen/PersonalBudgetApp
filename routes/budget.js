// routes/budget.js

const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');

// Route to create a new budget
// router.post('/budgets', async (req, res) => {
//   try {
//     const { category, amount, userId } = req.body;

//     // Create a new budget document
//     const budget = new Budget({ category, amount, userId });
//     await budget.save();

//     res.status(201).json(budget);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.post('/budgets', async (req, res) => {
    console.log(req.body);  // Log the request body to see what you get 
    const { category, amount, userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'UserID is required' });
    }
    try {
        const budget = new Budget({ category, amount, userId });
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        console.error("Error when saving budget:", error);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});


// Route to get all budgets for a specific user
router.get('/budgets/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all budgets for the specified user
    const budgets = await Budget.find({ userId });

    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add more routes for updating and deleting budgets if needed

module.exports = router;
