describe('Budget Management', () => {
    it('logs in and manages budget', () => {
        cy.visit('/login.html');
        cy.get('input[name=username]').type('testuser');
        cy.get('input[name=password]').type('password');
        cy.get('form').submit();
        cy.url().should('include', '/dashboard.html');
        cy.get('.btn').click(); // Assuming this is the button to add a new budget
        cy.get('input[name=amount]').type('100');
        cy.get('form').submit();
        // Add assertions to check if the budget displays correctly
    });
});
// Add this in your existing Cypress test or a new one
it('should display the dashboard correctly', () => {
    cy.visit('/dashboard.html');
    cy.eyesOpen({
        appName: 'Personal Budget App',
        testName: 'Dashboard View',
    });
    cy.eyesCheckWindow('Dashboard Page');
    cy.eyesClose();
});
