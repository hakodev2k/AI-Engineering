# Skill: Propagation Repair

## Purpose
Implement the smallest safe change that restores trace continuity without inventing correlation or weakening trust boundaries.

## Inputs
Verified propagation map, confirmed finding, repository conventions, relevant tests.

## Preconditions
At least one defect has evidence beyond a heuristic scanner finding.

## Allowed tools
Repository editing, formatter, compiler/build, unit/integration tests, deterministic package scripts.

## Constraints
Preserve public contracts unless explicitly required. Prefer standard propagation APIs/framework auto-instrumentation. Do not manually fabricate trace IDs. Do not trust inbound trace metadata without library validation.

## Procedure
1. Select one confirmed broken boundary.
2. Read nearby instrumentation and tests.
3. Choose the repository's existing propagator abstraction where possible.
4. Extract inbound context exactly once at the boundary that owns extraction.
5. Create child/consumer work from valid extracted context or documented links.
6. Inject current context immediately before the outbound operation.
7. Prevent stale context reuse across job executions or pooled objects.
8. Add focused tests proving trace identity/parentage or carrier propagation.
9. Run formatter, targeted tests, build, and scanner.
10. Inspect the diff for unrelated changes.
11. Hand evidence to the Verification Agent.

## Expected output
Minimal code/test diff plus updated evidence record.

## Verification
The repair must fail a focused test before the fix when practical and pass after the fix. Runtime evidence may supplement but not replace deterministic tests when tests are feasible.

## Failure handling
At most two implementation retries. Preserve failing commands and outputs. Stop rather than broad-refactor when the second attempt fails.

## Stop conditions
Stop before approval-required actions, breaking contracts, or production configuration changes.