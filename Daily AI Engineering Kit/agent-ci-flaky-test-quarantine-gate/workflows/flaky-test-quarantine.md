# Workflow: Flaky Test Quarantine

## Trigger
Intermittent CI test failure or proposal to retry/skip/quarantine a test.

## Entry conditions
Repository and test history are accessible; failing test identity is known.

## Stages
1. **Pre-task validation** — validate history, policy, and repository state.
2. **Classify** — Test Investigator runs deterministic statistics and evidence review.
3. **Investigate** — isolate root-cause hypotheses and run falsifiable experiments.
4. **Plan** — prefer a direct fix; if blocked, propose bounded quarantine.
5. **Approval** — stop for explicit human approval before adding/extending quarantine.
6. **Execute** — implementation owner applies the smallest safe fix or approved registry change.
7. **Test** — targeted repetitions plus normal host build/test suite.
8. **Gate** — run `scripts/flaky_test_gate.py` and `scripts/verify_package.py`.
9. **Verify** — independent Verification Agent reviews evidence and diff.
10. **Complete** — only when Definition of Done is satisfied.

## Produced artifacts
History JSON, investigation evidence, gate report, optional quarantine entry, approval evidence, test/build logs, verification result.

## Retry rules
- transient CI/log retrieval: max 2
- test-fix-retest implementation cycles: max 2
- invalid evidence/policy: no blind retry
- approval/permission failure: stop

## Failure paths
Deterministic failure -> fix path. Insufficient evidence -> gather more real runs. Expired quarantine -> block and repair/remove. Unknown owner/issue -> block.

## Definition of Done
Evidence-based classification exists, deterministic defects are not quarantined, active quarantine is approved and unexpired, host validation passes, policy gate passes, independent verification is `verified`, and no blocking risk remains.
