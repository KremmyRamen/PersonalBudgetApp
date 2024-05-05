// budgets.js in routes folder

const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const authenticateToken = require('../middleware/auth');

// Existing POST route for creating a budget
router.post('/budgets', authenticateToken, async (req, res) => {
    const { category, amount } = req.body;
    const userId = req.userId;  // Assuming your authentication middleware sets this
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

router.get('/budgets', authenticateToken, async (req, res) => {
    const sortQuery = req.query.sort;
    let sortOptions = {};

    switch (sortQuery) {
        case 'amount_desc':
            sortOptions = { amount: -1 };
            break;
        case 'amount_asc':
            sortOptions = { amount: 1 };
            break;
        case 'createdAt_desc':
            sortOptions = { createdAt: -1 };
            break;
        case 'createdAt_asc':
            sortOptions = { createdAt: 1 };
            break;
        default:
            sortOptions = { createdAt: -1 }; // Default to sorting by newest first
    }
    try {
        const budgets = await Budget.find({ userId: req.user._id })
            .select('category amount week1 week2 week3 week4');
        res.json(budgets);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
    // try {
    //     const budgets = await Budget.find({ userId: req.userId }).sort(sortOptions);
    //     res.json(budgets);
    // } catch (error) {
    //     console.error('Failed to retrieve budgets:', error);
    //     res.status(500).json({ success: false, message: 'Internal server error' });
    // }
});

router.delete('/budgets/:id', authenticateToken, async (req, res) => {
    try {
        const result = await Budget.deleteOne({ _id: req.params.id, userId: req.userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No budget found or user mismatch." });
        }
        res.json({ success: true, message: "Budget deleted successfully." });
    } catch (error) {
        console.error('Failed to delete budget:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/budgets/:id/spendings', authenticateToken, async (req, res) => {
  const { week1, week2, week3, week4 } = req.body;
  try {
      // Convert null or undefined to 0
      const updatedData = {
          week1: week1 !== undefined ? week1 : 0,
          week2: week2 !== undefined ? week2 : 0,
          week3: week3 !== undefined ? week3 : 0,
          week4: week4 !== undefined ? week4 : 0,
      };

      const budget = await Budget.findByIdAndUpdate(
          req.params.id,
          { $set: updatedData },
          { new: true }
      );

      if (!budget) {
          return res.status(404).json({ message: "Budget not found" });
      }

      res.json({ message: "Budget updated successfully", budget });
  } catch (error) {
      console.error("Error updating budget spending:", error);
      res.status(500).json({ message: "Internal server error", details: error.message });
  }
});


module.exports = router;
