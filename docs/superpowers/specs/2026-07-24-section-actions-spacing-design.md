# Section Actions Spacing

## Goal

Add a 15px space between section titles and their action controls on the affected
home-page sections.

## Design

- Rename the two incorrect `sections__actions` classes to the existing
  `section__actions` class so they use the shared section-header layout.
- Set the shared section-header column gap to `15px`.
- Keep the existing responsive row spacing unchanged.

## Verification

- Confirm no `sections__actions` classes remain.
- Run the project checks to ensure the stylesheet and templates still build.
