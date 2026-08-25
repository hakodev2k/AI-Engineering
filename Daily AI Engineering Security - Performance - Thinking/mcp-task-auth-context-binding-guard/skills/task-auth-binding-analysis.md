# Skill: Task Auth Binding Analysis

## Purpose
Threat-model and verify ownership binding for long-lived MCP tasks.

## Trigger
Adding Tasks support, reviewing a task store, or investigating unauthorized task access.

## Inputs
Task lifecycle, authenticated subject/tenant/resource model, task endpoints, storage schema, TTL policy.

## Preconditions
The host MUST provide trusted authentication context independently of model output.

## Required context
Which identity fields determine ownership and which task operations expose/mutate state.

## Allowed tools
Read-only source inspection, request traces with secrets redacted, unit/integration tests, policy checker.

## Constraints
Do not persist tokens/passwords. Do not use model-authored identity claims. Task ID possession alone MUST NOT grant protected access.

## Procedure
1. Enumerate create/get/cancel/update/result paths.
2. Identify the trusted auth middleware and normalized ownership tuple.
3. Verify task creation stores a non-reversible keyed binding to that tuple.
4. Verify every later endpoint recomputes and constant-time compares the binding.
5. Test same-principal, cross-principal, missing-auth, unknown-task, and tenant-boundary cases.
6. Verify logs contain no credentials or task result payloads.
7. Verify TTL/deletion removes stale bindings.
8. Have an independent verifier run negative tests.

## Decision points
Missing trusted identity => deny. Missing binding => deny protected access. Binding mismatch => deny and audit. Required ownership semantics unknown => stop for human design approval.

## Expected output
Threat boundaries, endpoint coverage, failing cases, remediation, test evidence.

## Metrics
Protected endpoint coverage, negative-test pass rate, missing-binding count, unauthorized access rate.

## Verification
Cross-principal tests must fail closed and raw secrets must not appear in persisted registry/logs.

## Failure handling
Preserve minimal audit evidence, revoke exposed task handles when possible, and stop access until ownership is re-established.

## Stop conditions
All endpoints enforce the same binding, or a blocking ownership ambiguity remains.