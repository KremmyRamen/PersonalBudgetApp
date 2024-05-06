const calculateBudget = require('./utils');

function calculateBudget(budget, weeklySpends) {
    const totalSpent = weeklySpends.reduce((acc, spend) => acc + spend, 0);
    return budget - totalSpent;
}

test('calculates remaining budget correctly', () => {
    const budget = 100;
    const spends = [10, 15, 20, 25];
    expect(calculateBudget(budget, spends)).toBe(30);
});