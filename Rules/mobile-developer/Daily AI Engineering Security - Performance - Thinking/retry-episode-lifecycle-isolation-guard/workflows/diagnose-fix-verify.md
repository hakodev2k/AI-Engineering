# Workflow: Diagnose → Fix → Verify Retry Lifecycle

## Trigger
Stale retry budget, premature termination, identical retry loops, or ambiguous reset behavior.

## Goal
Make retry accounting episode-scoped, bounded, observable, and safe.

## Inputs
Failure trace, successful control trace, retry policy, state-machine implementation, side-effect constraints.

## Baseline
Record attempts per logical failure episode, premature stops, repeated identical retries, recovery calls/tokens, and terminal outcome.

## Context
Use only observable event/state data: failure class, operation, state fingerprint, action, outcome, recovery boundary, and counts.

## Stages
1. **Observe** — collect failing and control traces.
2. **Measure baseline** — reconstruct current counter lifecycle.
3. **Diagnose** — identify leak, premature reset, or ineffective identical retry.
4. **Form hypothesis** — specify expected episode boundary/reset semantics.
5. **Implement improvement** — one scoped state-machine change.
6. **Measure again** — replay separated and consecutive failure cases.
7. **Improved?** — require correct reset plus bounded consecutive failures.
8. **Verify** — Recovery Verifier independently checks invariants and side-effect safety.

## Responsible agent
Investigator/implementer performs stages 1–6; `subagents/recovery-verifier.md` owns final verification.

## Tools
Structured traces, deterministic tests, `scripts/retry_episode_guard.py`.

## Outputs
Episode ledger, before/after metrics, changed lifecycle rule, verification decision.

## Checkpoints
Failure identity proven; recovery boundary observable; side-effect retry safety checked; tests pass; verifier independent.

## Metrics
Attempts/episode, premature-stop count, identical-retry rate, successful recovery rate, recovery token/tool-call overhead.

## Retry policy
Maximum two implementation hypotheses. Test failures are evidence; do not weaken assertions to force success.

## Stop conditions
Verified invariants; unsafe retry risk discovered; two hypotheses fail; or trace lacks enough evidence to define episode identity.

## Failure path
Revert unsafe change, preserve trace, return Blocked with exact missing event/state evidence.

## Verification
Run separated-failure, consecutive-failure, terminal-failure, and changed-strategy cases. Independent verifier reviews results.

## Definition of Done
Implemented: lifecycle rule and episode identity exist. Measured: before/after retry behavior is recorded. Verified: all invariants pass with no added unsafe side-effect retry path.
