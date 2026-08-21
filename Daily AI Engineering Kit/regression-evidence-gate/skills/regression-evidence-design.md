# Skill: Regression Evidence Design

## Purpose

Design the smallest reliable test set that proves the obligations produced by `behavior-to-test-obligations.md`.

## When to use

Use after obligations exist and before declaring the change verified.

## Inputs

- obligation list;
- existing tests and fixtures;
- repository-native test commands;
- changed implementation;
- known failure evidence.

## Preconditions

- each material changed behavior has an obligation;
- risk levels are assigned;
- required approvals are resolved.

## Process

1. Reuse an existing test only if its assertions prove the exact obligation.
2. Prefer the lowest-cost test tier that still exercises the relevant boundary.
3. Use unit tests for isolated deterministic business logic.
4. Use integration/contract tests when persistence, transport, serialization, middleware, dependency wiring, or cross-component behavior is material.
5. Use end-to-end tests only when lower layers cannot prove the user-visible flow.
6. For bug fixes, create a test that fails against the faulty behavior when practical.
7. For high-risk obligations, require at least one direct positive/expected proof and one negative/boundary proof unless the obligation itself is purely negative.
8. Keep fixtures deterministic; freeze time or inject clocks where time affects behavior.
9. Avoid real production resources and live credentials.
10. Run the narrow test set first, then the broader relevant suite.
11. Record command, file, test name or selector, result, and evidence note.
12. If a test fails, classify the failure before editing: implementation defect, test defect, environmental/transient, or unrelated pre-existing failure.

## Tools

Repository-native test runner, build tool, formatter, static analysis, approved local services/test containers, and file inspection.

## Constraints

- Do not alter production behavior solely to satisfy a brittle assertion.
- Do not delete, skip, mute, or weaken existing tests without explicit justification and approval when behavior protection would decrease.
- Do not claim coverage from a test that never reaches the changed behavior.
- Manual evidence is not a replacement for automatable tests unless the limitation is documented.

## Expected output

Updated `regression-evidence.json` entries with concrete evidence and execution results.

## Verification

Every required high-risk obligation must be covered or explicitly approved as an exception. Every covered obligation must reference an existing test file and a non-empty evidence note.

## Failure handling

For plausibly flaky/transient failures, rerun at most twice. If inconsistent results remain, mark the evidence inconclusive and stop verification.

## Stop conditions

Stop when all required obligations are either proven or explicitly unresolved; never loop indefinitely trying alternative assertions.
