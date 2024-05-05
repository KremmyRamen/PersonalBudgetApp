// Function to update navigation based on user authentication
function updateNavigation() {
    const token = localStorage.getItem('token');
    const loginSignupLink = document.getElementById('loginSignupLink');
    const logoutLink = document.getElementById('logoutLink');
    const homeLink = document.getElementById('homeLink');

    if (token) {
        loginSignupLink.style.display = 'none';
        logoutLink.style.display = 'block';
        homeLink.style.display = 'none';
    } else {
        loginSignupLink.style.display = 'block';
        logoutLink.style.display = 'none';
        homeLink.style.display = 'block';
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem('token');
    updateNavigation();
}

function fetchBudgets() {
    if (document.body.getAttribute('data-page') !== 'budgets') {
        console.log('fetchBudgets called on a non-budget page');
        return; // Exit the function early if not on the budgets page
    }

    const dropdown = document.getElementById('sortOrder');
    const token = localStorage.getItem('token');
    
    if (dropdown) {
        dropdown.disabled = true;
    }

    if (!token) {
        console.log('No token found, user must log in.');
        if (dropdown) {
            dropdown.disabled = false;
        }
        return;
    }

    fetch(`/api/budgets?sort=${dropdown ? dropdown.value : 'amount_desc'}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch sorted budgets');
        }
        return response.json();
    })
    .then(data => {
        displayBudgets(data);
    })
    .catch(error => {
        console.error('Error fetching budgets:', error);
    })
    .finally(() => {
        if (dropdown) {
            dropdown.disabled = false;
        }
    });
}

function displayBudgets(budgets) {
    const budgetsList = document.getElementById('budgetsList');

    if (!budgetsList) {
        console.error("Unable to find the budgets list element. This function is running on a page where it's not supposed to.");
        return;
    }

    budgetsList.innerHTML = '';

    budgets.forEach(budget => {
        const card = document.createElement('div');
        card.className = 'budget-card';

        const week1Value = budget.week1 !== undefined ? budget.week1 : '';
        const week2Value = budget.week2 !== undefined ? budget.week2 : '';
        const week3Value = budget.week3 !== undefined ? budget.week3 : '';
        const week4Value = budget.week4 !== undefined ? budget.week4 : '';

        card.innerHTML = `
            <div class="budget-header">
                <h4>${budget.category} - $${budget.amount}</h4>
                <i class="fas fa-trash-alt delete-icon" data-id="${budget._id}"></i>
            </div>
            <div id="details-${budget._id}" class="budget-details" style="display: none;">
                <form id="form-${budget._id}">
                    <div class="week-input">
                        <label for="week1-${budget._id}">Week 1: $</label>
                        <input type="number" id="week1-${budget._id}" name="week1" value="${week1Value}" placeholder="Enter amount" />
                    </div>
                    <div class="week-input">
                        <label for="week2-${budget._id}">Week 2: $</label>
                        <input type="number" id="week2-${budget._id}" name="week2" value="${week2Value}" placeholder="Enter amount" />
                    </div>
                    <div class="week-input">
                        <label for="week3-${budget._id}">Week 3: $</label>
                        <input type="number" id="week3-${budget._id}" name="week3" value="${week3Value}" placeholder="Enter amount" />
                    </div>
                    <div class="week-input">
                        <label for="week4-${budget._id}">Week 4: $</label>
                        <input type="number" id="week4-${budget._id}" name="week4" value="${week4Value}" placeholder="Enter amount" />
                    </div>
                    <button type="button" onclick="saveWeekSpending('${budget._id}')">Save</button>
                </form>
            </div>
        `;

        budgetsList.appendChild(card);

        card.querySelector('.budget-header').addEventListener('click', function() {
            toggleBudgetDetails(budget._id);
        });
    });
}

function saveWeekSpending(budgetId) {
    const form = document.getElementById('form-' + budgetId);
    const weekData = {
        week1: form.querySelector('[name="week1"]').value || 0,
        week2: form.querySelector('[name="week2"]').value || 0,
        week3: form.querySelector('[name="week3"]').value || 0,
        week4: form.querySelector('[name="week4"]').value || 0,
    };

    fetch(`/api/budgets/${budgetId}/spendings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(weekData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to save spending data');
        }
    })
    .then(data => {
        console.log('Spendings saved:', data);
        alert('Spending saved successfully!');
        fetchBudgets();
    })
    .catch(error => {
        console.error('Error saving spendings:', error);
        alert('Error saving spending data. Please try again.');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const budgetsList = document.getElementById('budgetsList');

    if (budgetsList) {
        budgetsList.addEventListener('click', function(event) {
            console.log('Clicked element:', event.target);
            if (event.target.classList.contains('delete-icon')) {
                console.log('Delete icon clicked, budgetId:', event.target.getAttribute('data-id'));
                event.stopPropagation();
                deleteBudget(event.target.getAttribute('data-id'));
            }
        });
    } else {
        console.error('Unable to find the budgets list element.');
    }
});

function deleteBudget(budgetId) {
    console.log('Attempting to delete budget:', budgetId);
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found, user must log in.');
        return;
    }

    fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete budget');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Budget deleted successfully');
            fetchBudgets();
        } else {
            console.error('Failed to delete budget:', data.message);
        }
    })
    .catch(error => console.error('Error deleting budget:', error));
}

function toggleBudgetDetails(budgetId) {
    console.log('Toggling budget details for budgetId:', budgetId);
    const detailsDiv = document.getElementById(`details-${budgetId}`);
    if (detailsDiv) {
        detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
    }
}
