# Decision Scenarios

## Scenario 1 — Healthy
All required metrics remain inside healthy bounds, smoke tests pass, data-integrity checks pass, and no blocking business signal exists. Deterministic gate returns `healthy`. Reviewer confirms evidence completeness. No rollback approval is requested.

## Scenario 2 — Observe
Error rate is above the observe threshold but below rollback threshold, latency is recovering, availability remains healthy, and smoke tests pass. Gate returns `observe` while the policy observation window remains open. The analyst must state the next decision point and required evidence. Observation cannot silently exceed the configured maximum.

## Scenario 3 — Rollback recommended
A critical metric crosses its rollback threshold or configured smoke/data-integrity checks fail. Gate returns `rollback-recommended`. Reviewer checks scope and competing causes. The workflow stops before production mutation and requests explicit human approval.

## Scenario 4 — Evidence blocked
A required metric is missing or stale, or policy/evidence cannot be parsed. Gate returns `blocked`. The system must not interpret lack of evidence as release health.

## Scenario 5 — Deployment rollback succeeded but recovery did not
The external deployment system reports rollback success, but required recovery samples remain outside recovery thresholds. `verify-rollback-result.py` fails. The workflow remains in incident/recovery state and does not declare verified success.