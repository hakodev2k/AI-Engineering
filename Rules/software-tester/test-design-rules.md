# Test Design Rules

## Purpose
Produce efficient tests that expose meaningful defects rather than duplicate happy paths.
## Scope
Manual and automated functional test design.
## MUST
- Cover representative equivalence classes, boundaries, invalid inputs, state transitions, and critical combinations where applicable.
- Give each test a clear precondition, action, expected result, and observable oracle.
- Design tests independently of implementation details unless implementation-specific verification is intentional.
## MUST NOT
- Duplicate tests without distinct risk coverage.
- Use an expected result that merely repeats the action.
## SHOULD
- Apply pairwise, decision-table, state-transition, or model-based techniques when they reduce combinatorial waste.
## Exceptions
Exploratory charters may be less scripted but must state mission and evidence expectations.
## Verification
Peer-review tests against risks, boundaries, negative paths, and requirement traceability.