/*
Copyright 2022 Toolchain Labs, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (see LICENSE).
*/

import { loadFixture } from '../utils';

describe('Graph Controls ', () => {
  beforeEach(() => {
    loadFixture();
  });

  it('should reset graph on refresh button', () => {
    cy.get('div').contains(/^src$/);
    cy.get('div').contains('pytnon').should('not.exist');

    cy.get('div').get(`#chevron-src`).click({ force: true });
    cy.get('div').contains(/^python$/);

    cy.get('#refresh-graph').click();

    cy.get('div').contains(/^src$/);
    cy.get('div').contains('pytnon').should('not.exist');
  });

  it('should reset node description on refresh button', () => {
    cy.get('div').contains(/^src$/).click();
    cy.get('div').get(`#chevron-src`).click({ force: true });
    cy.get('#description-display-name').contains(/^src$/);

    cy.get('#refresh-graph').click();
  });
});
