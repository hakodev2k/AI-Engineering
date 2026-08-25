# Visualization Testing

## Purpose
Prevent regressions in calculations, rendering, interaction, accessibility, and visual semantics.

## When to use
For production visualization code, dashboard changes, component libraries, and metric migrations.

## Inputs
Visualization specification, test data, metric contracts, interaction states, supported browsers/devices.

## Core knowledge
A rendered chart can look plausible while being numerically wrong. Testing should cover transformation logic, semantic invariants, DOM/render output where stable, interactions, accessibility, and high-value visual regressions.

## Procedure
1. Identify critical numerical and semantic invariants.
2. Build deterministic fixtures covering normal and edge cases.
3. Unit-test transformations, scales, bins, and metric calculations.
4. Integration-test data contracts and filter context.
5. Test interactions including selection, reset, drill, and empty states.
6. Add accessibility assertions for labels, roles, focus, and keyboard behavior.
7. Use visual regression snapshots selectively for stable, high-value states.
8. Test responsive breakpoints and representative browsers.
9. Include missing, extreme, zero, negative, and large-cardinality cases.
10. Gate releases on critical failures.

## Decision points
Prefer semantic assertions over brittle pixel snapshots. Use visual diffing when layout or encoding itself is the contract.

## Common failure patterns
Snapshot-only testing; fixtures too clean; no tests for filter context; tolerances hiding numerical errors; flaky screenshot tests from animations or fonts.

## Verification
Introduce controlled faults to confirm tests detect wrong totals, broken filters, inaccessible controls, and rendering regressions.

## Expected output
A layered visualization test suite with deterministic fixtures and documented coverage of critical risks.

## Stop conditions
Stop release when tests reveal metric-semantic changes that have not been approved or reconciled.