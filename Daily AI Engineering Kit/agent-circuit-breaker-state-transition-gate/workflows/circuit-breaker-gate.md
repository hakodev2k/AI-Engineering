# Circuit Breaker State Transition Workflow

## Trigger
Unexpected breaker state, dependency incident, resilience change, or breaker-policy review.

## Entry conditions
Target service/operation and repository are identifiable; read access is available.

## Inputs
Task/incident, policy, code, tests, logs/metrics, optional evidence JSON.

## Stages
1. **Preflight — workflow owner:** run repository validation and locate breaker/fallback/config/tests. Artifact: baseline notes.
2. **Investigate — Breaker Investigator:** execute `skills/investigate-breaker.md`. Checkpoint: root cause confirmed or explicitly blocked.
3. **Plan — workflow owner:** choose smallest change and acceptance invariants. Stop if evidence does not justify a change.
4. **Approval — human:** required before production policy change, disabling breaker, increasing tolerance, security/secret/infrastructure change, destructive action, or breaking contract.
5. **Execute — Implementation Agent:** follow `skills/implement-breaker-fix.md`; create reproduction/regression tests.
6. **Test — Implementation Agent:** focused tests then relevant suite. One correction retry maximum.
7. **Verify — Verification Agent:** independently inspect diff, test evidence, state-transition behavior, and approvals.
8. **Complete — workflow owner:** report verified status and remaining risks.

## Tools
Repository search/read/edit tools, test/build runner, logs/metrics readers, `scripts/validate-circuit.py`.

## Checkpoints
Investigation evidence; approval boundary; passing reproduction; independent verification.

## Retry rules
Transient read/tool failures: maximum 2 retries, preserving error output. Implementation/test correction: maximum 1 retry after new evidence. Permission or approval failures: 0 retries. After limit, status is `blocked` or `failed` and evidence is preserved.

## Failure paths
Validation failure -> fix input/evidence, not thresholds. Build/test failure -> one evidence-driven correction. Permission failure -> stop. Environment failure -> preserve command/output and stop after two transient retries. Business-rule ambiguity -> stop before code changes.

## Definition of Done
Root cause/evidence recorded; required change and tests exist; focused and relevant tests pass; deterministic validation passes when applicable; independent verification is `passed`; required approvals exist; no unintended changes or unresolved blockers remain.
