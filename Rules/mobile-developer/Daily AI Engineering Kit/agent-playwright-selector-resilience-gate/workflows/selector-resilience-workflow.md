# Selector Resilience Workflow

```text
Trigger -> Reproduce/inspect evidence -> Classify -> Plan -> Edit -> Static gate -> Test x2 -> Independent verify -> Complete
```

## Trigger
A Playwright test is added/changed, a locator fails, or a UI refactor affects browser tests.

## Entry conditions
Expected behavior is known and the target environment is reproducible or trace evidence is available.

## Inputs
Test path, failure evidence, acceptance criteria, relevant UI/page-object code, policy.

## Stages
1. **Evidence — Investigator:** reproduce once or inspect trace/screenshot/error.
2. **Classification — Investigator:** identify brittle locator, state/race, product defect, environment issue, or ambiguous requirement.
3. **Plan — Investigator:** choose smallest semantic locator/state correction; list affected tests.
4. **Execute — Investigator:** edit only required test/helper files unless an approved product change is necessary.
5. **Static gate:** run `python scripts/scan_selectors.py --root . --policy config/policy.yaml --output selector-gate.json`.
6. **Checkpoint:** exit 2 blocks. Exit 1 requires review of warnings. Exit 0 passes static policy.
7. **Behavior test:** run affected Playwright test twice. Shared-helper changes require dependent test coverage.
8. **Verify — Verifier:** independently inspect locator semantics, diff, gate result, and repeated test evidence.
9. **Complete:** record status and residual risk.

## Retry rules
- Browser/tool startup transient failure: retry once.
- Locator/state revision: maximum 2 revisions; each returns to static gate and repeated testing.
- Product defect, permission failure, unknown expected behavior, or policy block is not automatically retryable.

## Approval points
Changing production UI/API contracts, introducing externally visible behavior changes, production config/security changes, deleting test coverage, or broad shared-framework changes requires explicit human approval.

## Failure paths
Product defect -> stop and report evidence. Environment unavailable after one retry -> inconclusive. Gate blocked -> stop. Two failed revisions -> escalate. Verification disagreement -> incomplete, not success.

## Produced artifacts
Changed test/helper files, `selector-gate.json`, failure/trace references, test run evidence, verification status.

## Definition of Done
Root cause is evidence-backed; no blocking selector finding remains; affected test passes twice; dependent tests pass when required; independent verifier returns `verified`; assertions were not weakened; no unapproved product contract change occurred.
