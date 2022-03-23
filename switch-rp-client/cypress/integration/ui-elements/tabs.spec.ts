context("Controller Interactions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#port-input").clear().type("3001");
  });

  it("should change tabs when a new tab is clicked", () => {
    //
  });
});
