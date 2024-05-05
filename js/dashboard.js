document.addEventListener('DOMContentLoaded', function() {
    fetchBudgetsForDashboard();
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.budget-card')) {
            document.querySelectorAll('.visualization-options').forEach(element => {
                element.style.display = 'none';
            });
        }
    });
});

function fetchBudgetsForDashboard() {
    const sortOrder = document.getElementById('sortOrder').value;
    fetch(`/api/budgets?sort=${sortOrder}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch budgets');
        }
        return response.json();
    })
    .then(data => {
        displayBudgetsForDashboard(data);
    })
    .catch(error => {
        console.error('Error fetching budgets:', error);
    });
}

function displayBudgetsForDashboard(budgets) {
    const container = document.getElementById('budgetsDashboard');
    container.innerHTML = '';

    budgets.forEach(budget => {
        const card = document.createElement('div');
        card.className = 'budget-card';
        card.setAttribute('data-id', budget._id);
        card.innerHTML = `
            <div class="budget-header">
                <h4>${budget.category} - $${budget.amount}</h4>
            </div>
            <div class="visualization-options">
                <ul>
                    <li><button onclick="showBarGraph('${budget._id}', [${budget.week1}, ${budget.week2}, ${budget.week3}, ${budget.week4}])">Bar Graph</button></li>
                    <li><button onclick="showPieChart('${budget._id}')">Pie Chart</button></li>
                    <li><button onclick="displayTextInfo('${budget._id}')">Text Info</button></li>
                </ul>
                <canvas id="chart-${budget._id}" style="width: 100%; height: 300px; display: none;"></canvas> <!-- Hide canvas initially -->
            </div>
        `;
        container.appendChild(card);

        card.querySelector('.budget-header').addEventListener('click', function(event) {
            event.stopPropagation();
            const options = card.querySelector('.visualization-options');
            options.style.display = options.style.display === 'none' ? 'block' : 'none';
            document.querySelectorAll('.visualization-options').forEach(other => {
                if (other !== options) {
                    other.style.display = 'none';
                }
            });
        });
    });
}

function showBarGraph(budgetId, weekSpending) {
    const canvas = document.getElementById(`chart-${budgetId}`);
    canvas.style.display = 'block'; // Make canvas visible
    const ctx = canvas.getContext('2d');
    if (window.barCharts && window.barCharts[budgetId]) {
        window.barCharts[budgetId].destroy(); // Destroy existing chart instance if any
    } else {
        window.barCharts = window.barCharts || {};
    }

    window.barCharts[budgetId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Weekly Spending',
                data: weekSpending,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            legend: {
                display: false, // Ensure the legend is visible if you want to keep it
                labels: {
                    fontColor: 'black', // Adjusts the font color of the legend
                    fontSize: 14, // Adjusts the font size of the legend
                }
            },
            title: {
                display: true,
                text: 'Weekly Spending', // Set the title text here
                fontColor: '#111', // You can specify the font color
                fontSize: 16, // And the font size
                padding: 20 // Adds padding above the title
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const label = data.datasets[tooltipItem.datasetIndex].label || '';
                        const value = tooltipItem.yLabel;
                        return `${label}: $${value}`;
                    }
                }
            }
        }
    });
}


function showPieChart(budgetId) {
    console.log('Showing pie chart for:', budgetId);
    // Implementation logic goes here
}

function displayTextInfo(budgetId) {
    console.log('Displaying text info for:', budgetId);
    // Implementation logic goes here
}
