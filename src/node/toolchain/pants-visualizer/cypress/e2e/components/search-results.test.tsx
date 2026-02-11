/*
Copyright 2022 Toolchain Labs, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (see LICENSE).
*/

import { loadFixture } from '../utils';

describe('Search ', () => {
  beforeEach(() => {
    loadFixture();
  });

  it('should find element by using search & select it', () => {
    cy.get('#search-box').type('src/python');
    cy.get('.search-result-item').first().click();

    cy.get('#description-display-name').contains(/^curator$/);
  });
});
