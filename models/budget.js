// models/budget.js

const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    week1: { type: Number, default: 0 },
    week2: { type: Number, default: 0 },
    week3: { type: Number, default: 0 },
    week4: { type: Number, default: 0 },
}, { timestamps: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
