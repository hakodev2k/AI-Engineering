# Skill: Lock Investigation

## Purpose
Diagnose duplicate execution, overlap, stale-holder writes, lock contention, or unsafe Redis lock code before changing behavior.

## When to use
Use when jobs overlap, the same resource is processed twice, lock acquisition stalls, ownership is lost, or repository code contains Redis-based mutual exclusion.

## Inputs
- Repository root and relevant service/module.
- Existing lock implementation and call sites.
- Representative logs or incident evidence when available.
- Resource identity used to build the lock key.

## Preconditions
- Read access to repository and non-secret runtime evidence.
- No production mutations are required for investigation.

## Allowed tools
Repository search, test runner, static analysis, local Redis/test container, logs, read-only metrics.

## Constraints
Do not change production data, delete lock keys, reveal credentials, or infer exclusivity from a successful past acquisition after the lease expired.

## Process
1. Locate every acquisition, renewal, release, timeout, and retry path.
2. Map lock key construction to the actual protected business resource.
3. Record lease length and worst-case critical-section duration.
4. Check whether release validates ownership atomically.
5. Check whether renewal validates ownership atomically.
6. Determine whether stale holders can still write after lease expiry; identify existing fencing or version checks.
7. Inspect exception, cancellation, crash, and timeout paths.
8. Find tests for contention, lease expiry, owner mismatch, and duplicate workers.
9. Separate confirmed facts from hypotheses and attach file/log evidence.
10. Produce the smallest safe remediation plan; do not implement until scope and safety are clear.

## Expected output
A finding set containing component, evidence, failure mode, confidence, risk, recommended change, and verification needed.

## Verification
Every high-confidence finding cites repository code, deterministic test output, or runtime evidence. Unknowns remain explicitly unknown.

## Failure handling
If the Redis implementation or lock caller cannot be located, stop with `blocked-context`. If credentials or production access would be required, request the evidence through an approved human path rather than escalating permissions.

## Stop conditions
Stop when the lock lifecycle and protected resource are understood well enough to prove or disprove the suspected failure mode, or when required evidence is unavailable.
