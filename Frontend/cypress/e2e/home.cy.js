describe('Home Page Test', () => {
    it('should load the home page', () => {
      cy.visit('http://localhost:5173'); 
      cy.contains('Welcome'); 
    });
  });
  