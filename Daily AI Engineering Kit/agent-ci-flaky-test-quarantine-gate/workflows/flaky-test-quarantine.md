# Flaky-Test Quarantine Workflow

## Trigger
A CI test fails on a known revision.

## Entry conditions
Test identity and failing log exist; rerun is safe; policy is available.

## Inputs
Revision, test ID, command, environment fingerprint, logs, policy.

## Stages
1. **Context — Failure Investigator:** inspect repository/test/fixtures and capture original failure. Artifact: evidence JSON.
2. **Baseline — Failure Investigator:** run bounded same-revision observations. Checkpoint: no more than `max_test_reruns` additional executions.
3. **Classify — script:** run `flaky_gate.py evaluate`. Deterministic failure blocks quarantine. Mixed outcomes proceed.
4. **Policy — script + Investigator:** protected-pattern and evidence gates. Ineligible cases stop.
5. **Quarantine proposal — Investigator:** record owner, reason, evidence, removal criterion. If policy requires human approval, stop until explicit approval exists.
6. **Repair — implementation owner:** fix root cause with smallest safe change. Production deployment, schema changes, destructive operations, breaking API changes, security weakening, or large dependency upgrades require separate explicit approval.
7. **Recovery — Verification Agent:** execute `skills/recover-quarantined-test.md` on an immutable candidate revision.
8. **Final verification — Verification Agent:** run package/project checks, inspect diff, confirm approvals and evidence.
9. **Complete:** remove quarantine only after recovery is verified.

## Retry rules
- Test reruns: maximum `max_test_reruns` from policy; only valid test executions count.
- Tool/runner transient failure: maximum 2 retries per operation; preserve error evidence.
- Build/test failure after a code change: maximum 2 repair cycles; each cycle must make a hypothesis-driven change and preserve prior output.
- After limits are reached, stop and escalate; never loop indefinitely.

## Failure paths
Deterministic failure -> normal bug-fix path. Protected test -> block quarantine. Environment mismatch -> stop. Permission failure -> stop. Repeated infrastructure failure -> stop with logs. Missing approval -> `blocked`.

## Definition of Done
Evidence validates; classification is reproducible; retry bounds were honored; quarantine, if used, is policy-eligible and approved where required; recovery threshold and containing suite pass; independent verification is `verified`; no blocking risk remains.
