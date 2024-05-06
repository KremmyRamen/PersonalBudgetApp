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
        console.log("Fetching budgets for dashboard...");
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
            console.log("Budgets fetched and displayed.");
        })
        .catch(error => {
            console.error('Error fetching budgets:', error);
        });
    }
    
    function displayBudgetsForDashboard(budgets) {
        const container = document.getElementById('budgetsDashboard'); // Make sure this is the correct ID
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
                        <li><button onclick="showPieChart('${budget._id}', [${budget.week1}, ${budget.week2}, ${budget.week3}, ${budget.week4}])">Pie Chart</button></li>
                        <li><button onclick="displayTextInfo('${budget._id}', [${budget.week1}, ${budget.week2}, ${budget.week3}, ${budget.week4}])">Text Info</button>
                        </li>
                    </ul>
                    <canvas id="chart-${budget._id}" style="width: 100%; height: 300px; display: none;"></canvas>
                    <div id="info-${budget._id}" class="budget-info" style="display: none;"></div>
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

    // Initialize a global object to store chart instances
    window.chartInstances = window.chartInstances || {};

    function destroyChart(chartId) {
        const chartInstance = window.chartInstances[chartId];
        if (chartInstance) {
            chartInstance.destroy();
            delete window.chartInstances[chartId]; // Ensure clean up of the instance
        }
    }

    function showBarGraph(budgetId, weekSpending) {
        const chartId = `chart-${budgetId}`;
        const infoId = `info-${budgetId}`;
        hideTextInfo(infoId); // Hide the text info

        const canvas = document.getElementById(chartId);
        canvas.style.display = 'block'; // Show the canvas
        const ctx = canvas.getContext('2d');

        if (window.chartInstances && window.chartInstances[chartId]) {
            window.chartInstances[chartId].destroy();
        } else {
            window.chartInstances = window.chartInstances || {};
        }

        window.chartInstances[chartId] = new Chart(ctx, {
            type: 'bar',
            data: getChartData('Weekly Spending', weekSpending),
            options: getChartOptions('Weekly Spending')
        });
    }

    function showPieChart(budgetId, weekSpending) {
        const chartId = `chart-${budgetId}`;
        const infoId = `info-${budgetId}`;
        hideTextInfo(infoId); // Hide the text info

        const canvas = document.getElementById(chartId);
        canvas.style.display = 'block'; // Show the canvas
        const ctx = canvas.getContext('2d');

        if (window.chartInstances && window.chartInstances[chartId]) {
            window.chartInstances[chartId].destroy();
        } else {
            window.chartInstances = window.chartInstances || {};
        }

        window.chartInstances[chartId] = new Chart(ctx, {
            type: 'pie',
            data: getChartData('Spending Distribution', weekSpending),
            options: getChartOptions()
        });
    }

    function displayTextInfo(budgetId, weekSpending) {
        const infoId = `info-${budgetId}`;
        const infoContainer = document.getElementById(infoId);
        infoContainer.innerHTML = getSpendingInfoHTML(weekSpending);
        infoContainer.style.display = 'block'; // Ensure the text container is visible
    }

    function hideTextInfo(infoId) {
        const infoContainer = document.getElementById(infoId);
        if (infoContainer) {
            infoContainer.style.display = 'none';
            infoContainer.innerHTML = ''; // Clear the previous info
        }
    }

    function hideChart(chartId) {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            canvas.style.display = 'none';
            const chartInstance = window.chartInstances[chartId];
            if (chartInstance) {
                chartInstance.destroy();
                delete window.chartInstances[chartId];
            }
        }
    }

    function getChartData(label, data) {
        return {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: label,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: 'white',
                borderWidth: 2
            }]
        };
    }

    function getChartOptions(title) {
        return {
            responsive: true,
            legend: { position: 'bottom' },
            title: {
                display: true,
                text: title
            }
        };
    }

    function getSpendingInfoHTML(weekSpending) {
        return `
            <h4>Weekly Spending Breakdown:</h4>
            <ul>
                <li>Week 1: $${weekSpending[0]}</li>
                <li>Week 2: $${weekSpending[1]}</li>
                <li>Week 3: $${weekSpending[2]}</li>
                <li>Week 4: $${weekSpending[3]}</li>
            </ul>
        `;
    }