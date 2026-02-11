/*
Copyright 2022 Toolchain Labs, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (see LICENSE).
*/

export const loadFixture = () => {
  cy.visit('/');
  cy.get('input[type=file]').selectFile(
    'cypress/fixtures/peekdata_fixed.json',
    { force: true }
  );
};
