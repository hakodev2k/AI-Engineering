# Workflow: Deadlock Reproduction and Fix Verification

## Trigger
Database deadlock incident or concurrency change affecting transaction/lock order.

## Entry conditions
Repository and incident evidence are readable; reproduction environment is approved.

## Stages
1. **Pre-change validation** — establish clean evidence boundaries.
2. **Investigate** — Deadlock Investigator maps transactions and produces baseline capture.
3. **Gate baseline** — confirm a directed wait-for cycle exists.
4. **Plan** — Fix Planner identifies the smallest cycle-breaking change.
5. **Approval checkpoint** — stop before schema/index/isolation/production changes.
6. **Implement** — implementation owner makes the approved minimal change.
7. **Test** — run unit/integration/concurrency tests.
8. **Reproduce candidate** — run bounded reproduction attempts and preserve every run.
9. **Gate candidate** — require configured clean-run count and zero cycles.
10. **Verify** — independent Verification Agent reviews evidence and diff.
11. **Complete** — only when Definition of Done is satisfied.

## Retry rules
- transient tool/harness failure: max 2 retries
- implementation/test failure: max 2 fix cycles
- permission or approval failure: no automatic retry
- deadlock after second fix cycle: stop and escalate

## Produced artifacts
Baseline capture, candidate capture, gate report, transaction map, fix plan, test/build evidence, approval record if required, verification result.

## Failure paths
Unreproduced baseline -> `not_reproduced`; candidate cycle -> `failed`; insufficient runs -> `blocked`; risky unapproved action -> `blocked`.

## Definition of Done
Baseline cycle proven; candidate minimum runs clean; relevant tests/build pass; diff reviewed; independent verification is `verified`; no blocking approval remains.
