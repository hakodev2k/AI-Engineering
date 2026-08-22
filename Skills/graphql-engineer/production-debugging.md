# GraphQL Production Debugging

## Purpose
Investigate production GraphQL failures safely by correlating operations, execution paths, dependencies, deployments, and client behavior.

## When to use
Use for elevated errors, incorrect partial data, timeouts, resolver failures, or client-specific production regressions.

## Inputs
Incident window, operation identity, traces, logs, metrics, schema/deployment history, and sanitized variables or reproduction data.

## Context to inspect
Inspect recent releases, operation hashes, resolver spans, null propagation, dependency errors, DataLoader behavior, database health, and affected client versions.

## Core knowledge
HTTP 200 does not imply GraphQL success. Errors may coexist with partial data. Debugging must distinguish parse/validation failures, authorization, resolver errors, downstream failures, and client contract mismatch.

## Procedure
1. Define impact, affected operations, clients, and start time.
2. Check deployment/configuration changes around onset.
3. Inspect GraphQL error codes and traces by operation identity.
4. Locate the first failing resolver or dependency, not only the final null.
5. Check nullability propagation and partial-data behavior.
6. Compare healthy versus failing requests.
7. Reproduce with sanitized inputs in a safe environment.
8. Mitigate with rollback, feature control, traffic shaping, or dependency action as appropriate.
9. Verify recovery using production indicators.
10. Record root cause and regression protection.

## Decision points
Rollback when a recent change has strong causal evidence and rollback risk is lower. Apply targeted mitigation when dependency or data conditions make rollback ineffective.

## Common failure patterns
Treating all 200 responses as healthy, logging sensitive variables, debugging only client symptoms, changing multiple things simultaneously, and ignoring schema/client version mismatch.

## Verification
Confirm error rate and latency recover, affected operations succeed, and a regression test or monitoring improvement captures the failure mode.

## Expected output
An evidence-backed incident diagnosis, safe mitigation, and prevention action.

## Stop conditions
Stop and escalate before destructive production changes or when required access exceeds incident permissions.