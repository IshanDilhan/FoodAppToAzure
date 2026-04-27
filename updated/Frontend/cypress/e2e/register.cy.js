describe('Restaurant Login Tests', () => {
    beforeEach(() => {
      // Adjust the URL to where the AuthModal/login page is accessible
      cy.visit('http://localhost:5173');
      // If the modal is not open by default, trigger it here
      // cy.get('[data-cy="open-auth-modal"]').click();
      cy.contains('Login').click(); // Assumes a Login tab/button is present
    });
  
    it('should login successfully with valid credentials', () => {
      cy.get('input[name="email"]').type('validrestaurant@example.com');
      cy.get('input[name="password"]').type('validpassword');
      cy.get('button[type="submit"]').click();
      // Should redirect to profile or show success
      cy.url().should('include', '/restaurant/profile');
      // Or check for a welcome message or dashboard element
      // cy.contains('Welcome');
    });
  
    it('should show error for incorrect password', () => {
      cy.get('input[name="email"]').type('validrestaurant@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('.text-red-500').should('be.visible').and('contain', 'Login failed');
      // Adjust error message as per your backend response
    });
  
    it('should show error for non-existent user', () => {
      cy.get('input[name="email"]').type('nonexistent@example.com');
      cy.get('input[name="password"]').type('anyPassword123');
      cy.get('button[type="submit"]').click();
      cy.get('.text-red-500').should('be.visible').and('contain', 'Login failed');
      // Adjust error message as per your backend response
    });
  
    it('should show validation errors for empty fields', () => {
      cy.get('button[type="submit"]').click();
      // Since HTML5 validation is enabled, Cypress will not submit if required fields are empty
      // If you want to check custom error messages, you may need to disable HTML5 validation in your component for testing
      cy.get('input[name="email"]:invalid').should('exist');
      cy.get('input[name="password"]:invalid').should('exist');
    });
  });
  