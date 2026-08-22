# Skill: Bug Investigation

## Purpose
Diagnose backend defects using evidence, isolate the root cause, and produce the smallest safe correction with regression protection.

## Trigger
Use for incorrect API behavior, exceptions, intermittent failures, stale data, failed background work, or production symptoms with uncertain cause.

## Inputs
- Symptom and business impact
- Reproduction steps when available
- Logs, traces, metrics, request IDs, timestamps
- Relevant code and deployment/version information
- Data samples or database evidence when permitted

## Procedure
1. Define expected vs actual behavior.
2. Establish scope: users, environments, versions, endpoints/jobs, frequency, severity.
3. Reproduce in the safest available environment.
4. Build a timeline from logs/traces/metrics and deployment history.
5. Trace the execution path and state transitions.
6. Generate explicit hypotheses ranked by evidence and impact.
7. Test hypotheses individually; do not modify several variables at once.
8. Identify root cause or clearly state the remaining uncertainty.
9. Implement the smallest safe correction.
10. Add regression tests that fail before the fix and pass after it when practical.
11. Re-run focused and adjacent tests, then inspect the diff.
12. Record evidence, root cause, corrective action, and prevention opportunity.

## Decisions
- Stabilize user impact before deep diagnosis when the incident is active.
- Prefer evidence from runtime behavior over assumptions from reading code alone.
- Distinguish trigger, contributing factors, and root cause.
- Avoid broad refactoring during urgent fixes unless the narrow fix is unsafe.

## Outputs
- Reproduction or evidence package
- Root-cause statement with confidence level
- Fix and tests
- Remaining risks
- Prevention recommendation

## Verification
- Original failing scenario no longer fails.
- Regression test or equivalent evidence exists.
- No new failure appears in adjacent behavior.

## Failure handling
If reproduction is impossible, preserve all available evidence, narrow the affected conditions, add diagnostic instrumentation if safe, and explicitly mark the diagnosis as provisional.

## Stop conditions
Stop before changing production data, security configuration, infrastructure, secrets, or irreversible database state without human approval.
